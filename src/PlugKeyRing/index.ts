import CryptoJS from 'crypto-js';
import { HttpAgent, PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';

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
import { recursiveParseBigint } from '../utils/object';
import { handleStorageUpdate } from '../utils/storage/utils';
import { getVersion } from '../utils/version';
import { Address } from '../interfaces/contact_registry';

import NetworkModule, { NetworkModuleParams } from './modules/NetworkModule';
import {
  CreateAndPersistKeyRingOptions,
  CreateImportResponse,
  CreateOptions,
  CreatePrincipalOptions,
  ImportMnemonicOptions,
} from './interfaces';
import { WALLET_METHODS } from './constants';

class PlugKeyRing {
  // state
  private state: PlugState;
  public isUnlocked = false;
  public isInitialized = false;
  public currentWalletId?: number;

  // adapters
  private storage: KeyringStorage;
  private fetch: any;
  private crypto: any; // TODO: see what functions are needed and create an interface.
  private networkModule: NetworkModule;

  // wallet methods
  public getBalances: (args?: { subaccount?: number }) => Promise<Array<TokenBalance>>;
  public getNFTs: (args?: { subaccount?: number, refresh?: boolean }) => Promise<NFTCollection[] | null>;
  public transferNFT: (args: { subaccount?: number; token: NFTDetails; to: string; standard: string; }) => Promise<NFTCollection[]>;
  public burnXTC: (args?: { to: string; amount: string; subaccount: number; }) => Promise<TokenInterfaces.BurnResult>;
  public registerToken: (args: { canisterId: string; standard?: string; subaccount?: number; logo?: string; }) => Promise<Array<TokenBalance>>;
  public removeToken: (args: { canisterId: string; subaccount?: number; }) => Promise<Array<TokenBalance>>;
  public getTokenInfo: (args: { canisterId: string, standard?: string, subaccount?: number }) => Promise<TokenBalance>;
  public getICNSData: (args: { subaccount?: number  }) => Promise<{ names: string[]; reverseResolvedName: string | undefined }>;
  public setReverseResolvedName: (args: { name: string, subaccount?: number }) => Promise<string>;
  public sign: (args: { payload: BinaryBlob, subaccount?: number }) => Promise<BinaryBlob>;
  public getContacts: (args: { subaccount?: number }) => Promise<Array<Address>>;
  public addContact: (args: { contact: Address, subaccount?: number }) => Promise<boolean>;
  public deleteContact: (args: { addressName: string, subaccount?: number }) => Promise<boolean>;
  public getAgent: (args?: { subaccount ?: number, host?: string }) => HttpAgent;
  public getBalance: (args: { token: StandardToken, subaccount?: number }) => Promise<TokenBalance>;
  public getTransactions: (args: { subaccount?: number }) => Promise<GetTransactionsResponse>;
  public send: (args: { to: string, amount: string, canisterId: string, opts?: TokenInterfaces.SendOpts }) => Promise<TokenInterfaces.SendResponse>;

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
    this.networkModule = new NetworkModule({
      fetch: this.fetch,
      storage: StorageAdapter,
      onNetworkChange: this.exposeWalletMethods.bind(this),
    });
    this.exposeWalletMethods();
  }

  // Wallet proxy methods
  private exposeWalletMethods(): void {
    WALLET_METHODS.forEach(method => {
      this[method] = async args => {
        const { subaccount, ...params } = args || {};
        const wallet = await this.getWallet(subaccount);
        await wallet.setNetwork(this.networkModule?.network);
        const response = await wallet[method](params);
        await this.updateWallet(wallet);
        return response;
      };
    });
  }

  public getPublicKey = async (subaccount?: number): Promise<PublicKey> => {
    const wallet = await this.getWallet(subaccount);
    return wallet.publicKey;
  };

  // Keyring aux methods
  private getWallet = async (subaccount?: number): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const index = (subaccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    return this.state?.wallets?.[index];
  };

  private updateWallet = async (wallet: PlugWallet): Promise<void> => {
    await this.checkUnlocked();
    const wallets = this.state.wallets;
    wallets.splice(wallet.walletNumber, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
  };

  public init = async (): Promise<void> => {
    const state = (await this.storage.get()) as StorageData;
    this.isUnlocked = !!state?.isUnlocked;
    this.isInitialized = !!state?.isInitialized;
    this.currentWalletId = state?.currentWalletId || 0;
  };

  public async getMnemonic(password: string): Promise<string> {
    const storage = await this.storage.get() as StorageData;
    const decrypted = await this.decryptState(storage?.vault, password);
    return decrypted.mnemonic || '';
  }

  // Storage get
  private loadFromPersistance = async (password: string): Promise<void> => {
    const storage = ((await this.storage.get()) || {}) as StorageData;
    const { vault, isInitialized, currentWalletId, version, networkModule } = storage;
    if (isInitialized && vault) {
      const newVersion = getVersion();
      const _decrypted =
        newVersion !== version
          ? handleStorageUpdate(version, this.decryptState(vault, password))
          : this.decryptState(vault, password);
      const { mnemonic, ...decrypted } = _decrypted;
      this.networkModule = new NetworkModule({
        ...(networkModule || _decrypted.networkModule || {}),
        fetch: this.fetch,
        storage: this.storage,
        onNetworkChange: this.exposeWalletMethods.bind(this),
      });
      const wallets = _decrypted.wallets.map(
        wallet =>
          new PlugWallet({
            ...wallet,
            mnemonic: mnemonic as string,
            fetch: this.fetch,
            network: this.networkModule.network ,
          })
      );
      this.state = { ...decrypted, wallets };
      this.isInitialized = isInitialized;
      this.currentWalletId = currentWalletId;
      this.exposeWalletMethods();
      if (newVersion !== version) {
        await this.saveEncryptedState({ wallets }, password, mnemonic);
        await this.storage.set({ version: newVersion });
      }
    }
  };

  // Key Management
  public create = async ({
    password = '',
    icon,
    name,
    entropy,
  }: CreateOptions): Promise<CreateImportResponse> => {
    const { mnemonic } = createAccount(entropy);
    const wallet = await this.createAndPersistKeyRing({
      mnemonic,
      password,
      icon,
      name,
    });
    return { wallet, mnemonic };
  };

  // Key Management
  public importMnemonic = async ({
    mnemonic,
    password,
  }: ImportMnemonicOptions): Promise<CreateImportResponse> => {
    const wallet = await this.createAndPersistKeyRing({ mnemonic, password });
    return { wallet, mnemonic };
  };

  // Key Management
  public createPrincipal = async (
    opts?: CreatePrincipalOptions
  ): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const mnemonic = await this.getMnemonic(this.state.password as string);
    const wallet = new PlugWallet({
      ...opts,
      mnemonic,
      walletNumber: this.state.wallets.length,
      fetch: this.fetch,
      network: this.networkModule.network,
    });
    const wallets = [...this.state.wallets, wallet];
    await this.saveEncryptedState({ wallets }, this.state.password);
    this.state.wallets = wallets;
    return wallet;
  };

  // Key Management
  public setCurrentPrincipal = async (walletNumber: number): Promise<void> => {
    await this.checkInitialized();
    this.validateSubaccount(walletNumber);
    this.currentWalletId = walletNumber;
    await this.storage.set({ currentWalletId: walletNumber });
  };

  // General
  public getState = async (): Promise<PlugState> => {
    await this.checkInitialized();
    this.checkUnlocked();
    return recursiveParseBigint({
      ...this.state,
      currentWalletId: this.currentWalletId,
    });
  };

  // General
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

  // General
  public lock = async (): Promise<void> => {
    this.isUnlocked = false;
    this.state = { wallets: [] };
    await this.storage.set({ isUnlocked: this.isUnlocked });
  };

  // Key Management
  public editPrincipal = async (
    walletNumber: number,
    { name, emoji }: { name?: string; emoji?: string }
  ): Promise<void> => {
    const wallet = await this.getWallet(walletNumber);
    if (name) wallet.setName(name);
    if (emoji) wallet.setIcon(emoji);
    await this.updateWallet(wallet);
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

  public getPemFile = async (walletNumber?: number): Promise<string> => {
    const wallet = await this.getWallet(walletNumber);
    return wallet.pemFile;
  };

  private checkUnlocked = (): void => {
    if (!this.isUnlocked) {
      throw new Error(ERRORS.STATE_LOCKED);
    }
  };

  // General
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
      network: this.networkModule.network,
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
      isUnlocked: true,
      currentWalletId: 0,
      version: getVersion(),
      vault: this.crypto.AES.encrypt(
        JSON.stringify({ mnemonic }),
        password
      ).toString(), // Pre-save mnemonic in storage
    });
    await this.saveEncryptedState(data, password);
    await this.unlock(password);
    return wallet;
  };

  // Storage
  private saveEncryptedState = async (
    newState,
    password,
    defaultMnemonic?
  ): Promise<void> => {
    const mnemonic = defaultMnemonic || (await this.getMnemonic(password));
    const stringData = JsonBigInt.stringify({
      ...this.state,
      ...newState,
      mnemonic,
    });
    const encrypted = this.crypto.AES.encrypt(stringData, password);
    await this.storage.set({ vault: encrypted.toString() });
  };

  // Storage
  private decryptState = (state, password): PlugState & { mnemonic: string, networkModule?: NetworkModuleParams } =>
    JSON.parse(
      this.crypto.AES.decrypt(state, password).toString(this.crypto.enc.Utf8)
    );

  public checkPassword = async (password: string): Promise<boolean> => {
    await this.checkInitialized();
    try {
      const { vault, isInitialized } = ((await this.storage.get()) ||
        {}) as StorageData;
      if (isInitialized && vault) {
        const decrypted = this.decryptState(vault, password);
        return decrypted.password === password;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

export default PlugKeyRing;
