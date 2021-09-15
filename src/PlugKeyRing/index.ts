import CryptoJS from 'crypto-js';
import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { GetAllUserNFTsResponse } from '@psychedelic/dab-js';
import { NFTDetails } from '@psychedelic/dab-js/dist/nft';

import { ERRORS } from '../errors';
import { GetTransactionsResponse } from '../utils/dfx/history/rosetta';
import PlugWallet from '../PlugWallet';
import { createAccount, getAccountId } from '../utils/account';
import { SendOpts } from '../utils/dfx/ledger/methods';
import { SendResponse } from '../utils/dfx/token';
import Storage from '../utils/storage';
import mockStore from '../utils/storage/mock';
import { validatePrincipalId } from './utils';
import { StandardToken, TokenBalance } from '../interfaces/ext';
import { BurnResult } from '../interfaces/xtc';
import { ConnectedApp } from '../interfaces/account';

interface PlugState {
  wallets: Array<PlugWallet>;
  password?: string;
  mnemonic?: string;
  currentWalletId?: number;
}

const store = process.env.NODE_ENV === 'test' ? mockStore : new Storage();

class PlugKeyRing {
  private state: PlugState;

  public isUnlocked = false;

  public isInitialized = false;

  public currentWalletId?: number;

  public constructor() {
    this.state = { wallets: [] };
    this.isUnlocked = false;
    this.isInitialized = false;
    this.currentWalletId = 0;
  }

  public init = async (): Promise<void> => {
    const state = await store.get();
    this.isUnlocked = !!state?.isUnlocked;
    this.isInitialized = !!state?.isInitialized;
    this.currentWalletId = state?.currentWalletId || 0;
  };

  public getPublicKey = async (subAccount): Promise<PublicKey> => {
    await this.checkInitialized();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    const wallet = this.state.wallets[index];
    return wallet.publicKey;
  };

  public getNFTs = async (
    subAccount?: number
  ): Promise<GetAllUserNFTsResponse> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;
    this.validateSubaccount(index);
    const wallet = wallets[index];
    return wallet.getNFTs();
  };

  public transferNFT = async ({
    subAccount,
    token,
    to,
    standard,
  }: {
    subAccount?: number;
    token: NFTDetails;
    to: string;
    standard: string;
  }): Promise<boolean> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;
    this.validateSubaccount(index);
    const wallet = wallets[index];
    return wallet.transferNFT({ token, to, standard });
  };

  private loadFromPersistance = async (password: string): Promise<void> => {
    interface StorageData {
      vault: PlugState;
      isInitialized: boolean;
      currentWalletId: number;
    }

    const { vault, isInitialized, currentWalletId } = ((await store.get()) ||
      {}) as StorageData;
    if (isInitialized && vault) {
      const decrypted = this.decryptState(vault, password);
      const wallets = decrypted.wallets.map(
        wallet =>
          new PlugWallet({
            ...wallet,
            mnemonic: decrypted.mnemonic as string,
          })
      );
      this.state = { ...decrypted, wallets };
      this.isInitialized = isInitialized;
      this.currentWalletId = currentWalletId;
    }
  };

  public burnXTC = async ({
    to,
    amount,
    subAccount,
  }: {
    to: string;
    amount: bigint;
    subAccount: number;
  }): Promise<BurnResult> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;
    this.validateSubaccount(index);
    const wallet = wallets[index];
    return wallet.burnXTC(to, amount);
  };

  public create = async ({
    password = '',
  }: {
    password: string;
  }): Promise<{ wallet: PlugWallet; mnemonic: string }> => {
    const { mnemonic } = createAccount();
    const wallet = await this.createAndPersistKeyRing({ mnemonic, password });
    return { wallet, mnemonic };
  };

  public importMnemonic = async ({
    mnemonic,
    password,
  }: {
    mnemonic: string;
    password: string;
  }): Promise<{ wallet: PlugWallet; mnemonic: string }> => {
    const wallet = await this.createAndPersistKeyRing({ mnemonic, password });
    return { wallet, mnemonic };
  };

  // Assumes the state is already initialized
  public createPrincipal = async (opts?: {
    name?: string;
    icon?: string;
  }): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const wallet = new PlugWallet({
      mnemonic: this.state.mnemonic as string,
      walletNumber: this.state.wallets.length,
      ...opts,
    });
    const wallets = [...this.state.wallets, wallet];
    await this.saveEncryptedState({ wallets }, this.state.password);
    this.state.wallets = wallets;
    return wallet;
  };

  public setCurrentPrincipal = async (walletNumber: number): Promise<void> => {
    await this.checkInitialized();
    this.validateSubaccount(walletNumber);
    this.currentWalletId = walletNumber;
    await store.set({ currentWalletId: walletNumber });
  };

  public getState = async (): Promise<PlugState> => {
    await this.checkInitialized();
    this.checkUnlocked();
    return { ...this.state, currentWalletId: this.currentWalletId };
  };

  public sign = async (
    payload: BinaryBlob,
    subAccount?: number
  ): Promise<BinaryBlob> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    const wallet = this.state.wallets[index];
    const signed = await wallet.sign(payload);
    return signed;
  };

  public unlock = async (password: string): Promise<boolean> => {
    await this.checkInitialized();
    try {
      await this.loadFromPersistance(password);
      this.isUnlocked = password === this.state?.password;

      await store.set({ isUnlocked: this.isUnlocked });
      return this.isUnlocked;
    } catch (e) {
      this.isUnlocked = false;
      return false;
    }
  };

  public lock = async (): Promise<void> => {
    this.isUnlocked = false;
    this.state = { wallets: [] };
    await store.set({ isUnlocked: this.isUnlocked });
  };

  public editPrincipal = async (
    walletNumber: number,
    { name, emoji }: { name?: string; emoji?: string }
  ): Promise<void> => {
    await this.checkInitialized();
    this.checkUnlocked();
    this.validateSubaccount(walletNumber);
    const wallet = this.state.wallets[walletNumber];
    if (name) wallet.setName(name);
    if (emoji) wallet.setIcon(emoji);
    const { wallets } = this.state;
    wallets.splice(walletNumber, 1, wallet);

    this.state.wallets = wallets;
    this.saveEncryptedState({ wallets }, this.state.password);
  };

  public registerToken = async (
    canisterId: string,
    subAccount?: number
  ): Promise<Array<StandardToken>> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;

    this.validateSubaccount(index);
    const wallet = wallets[index];
    const registeredTokens = await wallet.registerToken(canisterId);
    wallets.splice(index, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return registeredTokens;
  };

  public getBalance = async (
    subAccount?: number
  ): Promise<Array<TokenBalance>> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    return this.state.wallets[index].getBalance();
  };

  public getTokenInfo = async (
    canisterId: string,
    subAccount?: number
  ): Promise<{ token: StandardToken; amount: bigint }> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    return this.state.wallets[index].getTokenInfo(canisterId);
  };

  public getTransactions = async (
    subAccount?: number
  ): Promise<GetTransactionsResponse> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    return this.state.wallets[index].getTransactions();
  };

  private validateSubaccount(subaccount: number): void {
    if (
      subaccount < 0 ||
      !Number.isInteger(subaccount) ||
      subaccount >= (this.state.wallets.length || 0)
    ) {
      throw new Error(ERRORS.INVALID_WALLET_NUMBER);
    }
  }

  private checkInitialized = async (): Promise<void> => {
    await this.init();
    if (!this.isInitialized) throw new Error(ERRORS.NOT_INITIALIZED);
  };

  public send = async (
    to: string,
    amount: bigint,
    canisterId?: string,
    opts?: SendOpts
  ): Promise<SendResponse> => {
    this.checkUnlocked();
    const currentWalletNumber = this.currentWalletId;
    let account = to;
    if (!canisterId && validatePrincipalId(to)) {
      account = getAccountId(Principal.fromText(to));
    }
    return this.state.wallets[currentWalletNumber || 0].send(
      account,
      amount,
      canisterId,
      opts
    );
  };

  public addConnectedApp = async (
    app: ConnectedApp,
    subAccount?: number
  ): Promise<Array<ConnectedApp>> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    const { wallets } = this.state;
    const wallet = wallets[index];
    const apps = wallet.addConnectedApp(app);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return apps;
  };

  public deleteConnectedApp = async (
    id: string,
    subAccount?: number
  ): Promise<Array<ConnectedApp>> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    const { wallets } = this.state;
    const wallet = wallets[index];
    const apps = wallet.deleteConnectedApp(id);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return apps;
  };

  public get currentWallet(): PlugWallet {
    this.checkUnlocked();
    return this.state.wallets[this.currentWalletId || 0];
  }

  public getPemFile = (walletNumber?: number): string => {
    this.checkUnlocked();
    const currentWalletNumber = (walletNumber ?? this.currentWalletId) || 0;
    this.validateSubaccount(currentWalletNumber);
    return this.state.wallets[currentWalletNumber].pemFile;
  };

  private checkUnlocked = (): void => {
    if (!this.isUnlocked) {
      throw new Error(ERRORS.STATE_LOCKED);
    }
  };

  private createAndPersistKeyRing = async ({
    mnemonic,
    password,
  }): Promise<PlugWallet> => {
    if (!password) throw new Error(ERRORS.PASSWORD_REQUIRED);
    const wallet = new PlugWallet({ mnemonic, walletNumber: 0 });
    const data = {
      wallets: [wallet.toJSON()],
      password,
      mnemonic,
    };
    this.isInitialized = true;
    this.currentWalletId = 0;
    await store.set({
      isInitialized: true,
      isUnlocked: false,
      currentWalletId: 0,
    });
    await this.saveEncryptedState(data, password);
    return wallet;
  };

  private saveEncryptedState = async (newState, password): Promise<void> => {
    const stringData = JSON.stringify({ ...this.state, ...newState });
    const encrypted = CryptoJS.AES.encrypt(stringData, password).toString();
    await store.set({ vault: encrypted });
  };

  private decryptState = (state, password): PlugState =>
    JSON.parse(
      CryptoJS.AES.decrypt(state, password).toString(CryptoJS.enc.Utf8)
    );
}

export default PlugKeyRing;
