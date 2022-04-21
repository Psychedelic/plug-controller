import CryptoJS from 'crypto-js';
import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import {
  NFTDetails,
  NFTCollection,
  TokenInterfaces,
} from '@psychedelic/dab-js';
import JsonBigInt from 'json-bigint';

import { KeyringStorage, StorageData } from '../interfaces/storage';
import { PlugState } from '../interfaces/plug_keyring';
import { TokenBalance, StandardToken } from '../interfaces/token';
import { GetTransactionsResponse } from '../interfaces/transactions';
import { ERRORS } from '../errors';
import PlugWallet from '../PlugWallet';
import { createAccount } from '../utils/account';
import Storage from '../utils/storage';
import { validatePrincipalId } from './utils';
import { ConnectedApp } from '../interfaces/account';
import { recursiveParseBigint } from '../utils/object';
import { handleStorageUpdate } from '../utils/storage/utils';
import { getVersion } from '../utils/version';
import { RecordExt } from '../interfaces/icns_registry';

interface CreatePrincipalOptions {
  name?: string;
  icon?: string;
}

interface CreateOptions extends CreatePrincipalOptions {
  password: string;
  entropy?: Buffer;
}

interface CreateAndPersistKeyRingOptions extends CreateOptions {
  mnemonic: string;
}

interface ImportMnemonicOptions {
  mnemonic: string;
  password: string;
}

class PlugKeyRing {
  private state: PlugState;

  private storage: KeyringStorage;

  private fetch: any;

  private crypto: any; // TODO: see what functions are needed and create an interface.

  public isUnlocked = false;

  public isInitialized = false;

  public currentWalletId?: number;

  public constructor(
    StorageAdapter = new Storage() as KeyringStorage,
    CryptoAdapter = CryptoJS,
    FetchAdapter?: any
  ) {
    this.state = { wallets: [] };
    this.isUnlocked = false;
    this.isInitialized = false;
    this.currentWalletId = 0;
    this.storage = StorageAdapter;
    this.crypto = CryptoAdapter;
    this.fetch = FetchAdapter;
  }

  public init = async (): Promise<void> => {
    const state = (await this.storage.get()) as StorageData;
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
    subAccount?: number,
    refresh?: boolean,
  ): Promise<NFTCollection[] | null> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;
    this.validateSubaccount(index);
    const wallet = wallets[index];
    const nfts = await wallet.getNFTs(refresh);

    wallets.splice(index, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return nfts;
  };

  public transferNFT = async ({
    subAccount,
    token,
    to,
  }: {
    subAccount?: number;
    token: NFTDetails;
    to: string;
    standard: string;
  }): Promise<NFTCollection[]> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;
    this.validateSubaccount(index);
    const wallet = wallets[index];
    const collections = await wallet.transferNFT({ token, to });
    wallets.splice(index, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return collections;
  };

  private loadFromPersistance = async (password: string): Promise<void> => {
    const {
      vault,
      isInitialized,
      currentWalletId,
      version,
    } = ((await this.storage.get()) || {}) as StorageData;
    if (isInitialized && vault) {
      const newVersion = getVersion();
      const decrypted =
        newVersion === version
          ? this.decryptState(vault, password)
          : handleStorageUpdate(version, this.decryptState(vault, password));
      const wallets = decrypted.wallets.map(
        wallet =>
          new PlugWallet({
            ...wallet,
            mnemonic: decrypted.mnemonic as string,
            fetch: this.fetch,
          })
      );
      this.state = { ...decrypted, wallets };
      this.isInitialized = isInitialized;
      this.currentWalletId = currentWalletId;
      if (newVersion !== version) {
        this.saveEncryptedState({ wallets }, password);
        this.storage.set({ version: newVersion });
      }
    }
  };

  public burnXTC = async ({
    to,
    amount,
    subAccount,
  }: {
    to: string;
    amount: string;
    subAccount: number;
  }): Promise<TokenInterfaces.BurnResult> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;
    this.validateSubaccount(index);
    const wallet = wallets[index];
    return wallet.burnXTC(to, amount);
  };

  public create = async ({
    password = '',
    icon,
    name,
    entropy,
  }: CreateOptions): Promise<{
    wallet: PlugWallet;
    mnemonic: string;
  }> => {
    const { mnemonic } = createAccount(entropy);
    const wallet = await this.createAndPersistKeyRing({
      mnemonic,
      password,
      icon,
      name,
    });
    return { wallet, mnemonic };
  };

  public importMnemonic = async ({
    mnemonic,
    password,
  }: ImportMnemonicOptions): Promise<{
    wallet: PlugWallet;
    mnemonic: string;
  }> => {
    const wallet = await this.createAndPersistKeyRing({ mnemonic, password });
    return { wallet, mnemonic };
  };

  // Assumes the state is already initialized
  public createPrincipal = async (
    opts?: CreatePrincipalOptions
  ): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const wallet = new PlugWallet({
      ...opts,
      mnemonic: this.state.mnemonic as string,
      walletNumber: this.state.wallets.length,
      fetch: this.fetch,
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
    await this.storage.set({ currentWalletId: walletNumber });
  };

  public getState = async (): Promise<PlugState> => {
    await this.checkInitialized();
    this.checkUnlocked();
    return recursiveParseBigint({
      ...this.state,
      currentWalletId: this.currentWalletId,
    });
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
      await this.storage.set({ isUnlocked: this.isUnlocked });
      return this.isUnlocked;
    } catch (e) {
      console.error('UNLOCK ERROR:', e);
      this.isUnlocked = false;
      return false;
    }
  };

  public lock = async (): Promise<void> => {
    this.isUnlocked = false;
    this.state = { wallets: [] };
    await this.storage.set({ isUnlocked: this.isUnlocked });
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
    standard = 'ext',
    subAccount?: number
  ): Promise<Array<TokenBalance>> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;

    this.validateSubaccount(index);
    const wallet = wallets[index];
    const registeredTokens = await wallet.registerToken(canisterId, standard);
    wallets.splice(index, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return registeredTokens;
  };

  public removeToken = async (
    canisterId: string,
    subAccount?: number
  ): Promise<Array<TokenBalance>> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    const { wallets } = this.state;

    this.validateSubaccount(index);
    const wallet = wallets[index];
    const registeredTokens = await wallet.removeToken(canisterId);
    wallets.splice(index, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
    return registeredTokens;
  };

  public getBalance = async (
    token: StandardToken,
    subAccount?: number
  ): Promise<TokenBalance> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    const wallet = this.state.wallets[index];
    return wallet.getTokenBalance(token);
  };

  public getBalances = async (
    subAccount?: number
  ): Promise<Array<TokenBalance>> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    return this.state.wallets[index].getBalances();
  };

  public getTokenInfo = async (
    canisterId: string,
    standard = 'ext',
    subAccount?: number
  ): Promise<{ token: StandardToken; amount: string }> => {
    this.checkUnlocked();
    const index = (subAccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    return this.state.wallets[index].getTokenInfo(canisterId, standard);
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
    amount: string,
    canisterId: string,
    opts?: TokenInterfaces.SendOpts
  ): Promise<TokenInterfaces.SendResponse> => {
    this.checkUnlocked();
    const currentWalletNumber = this.currentWalletId;
    let account = to;
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

  public getICNSData = (walletNumber?: number): Promise<{ names: string[], reverseResolvedName: string | undefined}> => {
    this.checkUnlocked();
    const currentWalletNumber = (walletNumber ?? this.currentWalletId) || 0;
    this.validateSubaccount(currentWalletNumber);
    return this.state.wallets[currentWalletNumber].getICNSData();
  };

  private checkUnlocked = (): void => {
    if (!this.isUnlocked) {
      throw new Error(ERRORS.STATE_LOCKED);
    }
  };

  private createAndPersistKeyRing = async ({
    mnemonic,
    password,
    icon,
    name,
  }: CreateAndPersistKeyRingOptions): Promise<PlugWallet> => {
    if (!password) throw new Error(ERRORS.PASSWORD_REQUIRED);
    const wallet = new PlugWallet({
      icon,
      name,
      mnemonic,
      walletNumber: 0,
      fetch: this.fetch,
    });

    const data = {
      wallets: [wallet.toJSON()],
      password,
      mnemonic,
    };

    this.isInitialized = true;
    this.currentWalletId = 0;
    await this.storage.clear();
    await this.storage.set({
      isInitialized: true,
      isUnlocked: false,
      currentWalletId: 0,
      version: getVersion(),
    });
    await this.saveEncryptedState(data, password);
    return wallet;
  };

  private saveEncryptedState = async (newState, password): Promise<void> => {
    const stringData = JsonBigInt.stringify({ ...this.state, ...newState });
    const encrypted = this.crypto.AES.encrypt(stringData, password);
    await this.storage.set({ vault: encrypted.toString() });
  };

  private decryptState = (state, password): PlugState =>
    JSON.parse(
      this.crypto.AES.decrypt(state, password).toString(this.crypto.enc.Utf8)
    );
}

export default PlugKeyRing;
