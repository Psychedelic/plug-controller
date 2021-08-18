import CryptoJS from 'crypto-js';
import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';

import { ERRORS } from '../errors';
import { GetTransactionsResponse } from '../utils/dfx/rosetta';
import PlugWallet from '../PlugWallet';
import { createAccount, getAccountId } from '../utils/account';
import { SendOpts } from '../utils/dfx/ledger/methods';
import Storage from '../utils/storage';
import mockStore from '../utils/storage/mock';
import { validatePrincipalId } from './utils';
import { StandardToken, TokenBalance } from '../interfaces/token';

interface PlugState {
  wallets: Array<PlugWallet>;
  currentWalletId?: number;
  password?: string;
  mnemonic?: string;
}

const store = process.env.NODE_ENV === 'test' ? mockStore : new Storage();

class PlugKeyRing {
  private state: PlugState;

  public isUnlocked = false;

  public isInitialized = false;

  public constructor() {
    this.state = { wallets: [], currentWalletId: 0 };
    this.isUnlocked = false;
    this.isInitialized = false;
  }

  public init = async (): Promise<void> => {
    const state = await store.get();
    this.isUnlocked = !!state?.isUnlocked;
    this.isInitialized = !!state?.isInitialized;
  };

  public getPublicKey = async (subaccount = 0): Promise<PublicKey> => {
    await this.checkInitialized();
    this.validateSubaccount(subaccount);
    const wallet = this.state.wallets[subaccount];
    return wallet.publicKey;
  };

  private loadFromPersistance = async (password: string): Promise<void> => {
    interface StorageData {
      vault: PlugState;
      isInitialized: boolean;
    }

    const { vault, isInitialized } = ((await store.get()) || {}) as StorageData;
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
    }
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
    this.state.currentWalletId = walletNumber;
  };

  public getState = async (): Promise<PlugState> => {
    await this.checkInitialized();
    this.checkUnlocked();
    return this.state;
  };

  public sign = async (
    payload: BinaryBlob,
    subaccount = 0
  ): Promise<BinaryBlob> => {
    this.checkUnlocked();
    this.validateSubaccount(subaccount);
    const wallet = this.state.wallets[subaccount];
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
    subAccount = 0
  ): Promise<Array<StandardToken>> => {
    this.checkUnlocked();
    const index = subAccount || this.state.currentWalletId || 0;
    const { wallets } = this.state;

    this.validateSubaccount(index);
    const wallet = wallets[index];
    const registeredTokens = await wallet.registerToken(canisterId);
    wallets.splice(subAccount, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return registeredTokens;
  };

  public getBalance = async (
    subAccount?: number
  ): Promise<Array<TokenBalance>> => {
    this.checkUnlocked();
    const index = subAccount || this.state.currentWalletId || 0;
    this.validateSubaccount(index);
    return this.state.wallets[index].getBalance();
  };

  public getTokenInfo = async (canisterId: string, subAccount?: number) => {
    this.checkUnlocked();
    const index = subAccount || this.state.currentWalletId || 0;
    this.validateSubaccount(index);
    return this.state.wallets[index].getTokenInfo(canisterId);
  };

  public getTransactions = async (
    subAccount?: number
  ): Promise<GetTransactionsResponse> => {
    this.checkUnlocked();
    const index = subAccount || this.state.currentWalletId || 0;
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
  ): Promise<bigint> => {
    this.checkUnlocked();
    const currentWalletNumber = this.state.currentWalletId;
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

  public get currentWallet(): PlugWallet {
    this.checkUnlocked();
    return this.state.wallets[this.state.currentWalletId || 0];
  }

  public getPemFile = (walletNumber?: number): string => {
    this.checkUnlocked();
    const currentWalletNumber = walletNumber || this.state.currentWalletId || 0;
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
      currentWalletId: 0,
      password,
      mnemonic,
    };
    this.isInitialized = true;
    await store.set({ isInitialized: true, isUnlocked: false });
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
