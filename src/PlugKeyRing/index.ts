import CryptoJS from 'crypto-js';
import { HttpAgent, PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';

import {
  NFTDetails,
  TokenInterfaces,
} from '@psychedelic/dab-js';
import JsonBigInt from 'json-bigint';
import { v4 as uuid } from "uuid";

import { createWallet } from '../PlugWallet';
import PlugWallet from '../PlugWallet/base';
import { PlugStateStorage, PlugStateInstance } from '../interfaces/plug_keyring';
import { GetTransactionsResponse } from '../interfaces/transactions';
import { KeyringStorage, StorageData } from '../interfaces/storage';
import { TokenBalance, StandardToken } from '../interfaces/token';
import { WalletNFTCollection } from '../interfaces/plug_wallet';
import { Address } from '../interfaces/contact_registry';
import { ERRORS } from '../errors';
import { IdentityFactory } from './../utils/identity/identityFactory'
import { handleStorageUpdate } from '../utils/storage/utils';
import { createAccountFromMnemonic } from '../utils/account';
import { recursiveParseBigint } from '../utils/object';
import { IDENTITY_TYPES } from '../utils/account/constants';
import { createAccount } from '../utils/account';
import { getVersion } from '../utils/version';
import Storage from '../utils/storage';

import NetworkModule, { NetworkModuleParams } from './modules/NetworkModule';
import {
  CreateAndPersistKeyRingOptions,
  CreateImportResponse,
  CreateOptions,
  CreatePrincipalOptions,
  ImportMnemonicOptions,
  ImportFromPemOptions,
  ImportFromLedgerOptions,
} from './interfaces';
import { WALLET_METHODS, MAIN_WALLET_METHODS } from './constants';
import { getIdentityFromPem } from './../utils/identity/parsePem'
import LedgerIdentity from '../utils/identity/ledger';

class PlugKeyRing {
  // state
  private state: PlugStateInstance;
  public isUnlocked = false;
  public isInitialized = false;
  public currentWalletId: string;
  public mnemonicWalletCount: number;

  // adapters
  private storage: KeyringStorage;
  private fetch: any;
  private crypto: any; // TODO: see what functions are needed and create an interface.
  private networkModule: NetworkModule;

  // wallet methods
  public getBalances: (args?: { subaccount?: string }) => Promise<Array<TokenBalance>>;
  public getNFTs: (args?: { subaccount?: string, refresh?: boolean }) => Promise<WalletNFTCollection[] | null>;
  public transferNFT: (args: { subaccount?: string; token: NFTDetails; to: string; standard: string; }) => Promise<boolean>;
  public burnXTC: (args?: { to: string; amount: string; subaccount: string; }) => Promise<TokenInterfaces.BurnResult>;
  public registerToken: (args: { canisterId: string; standard?: string; subaccount?: string; logo?: string; }) => Promise<TokenBalance>;
  public removeToken: (args: { canisterId: string; subaccount?: string; }) => Promise<Array<StandardToken>>;
  public getTokenInfo: (args: { canisterId: string, standard?: string, subaccount?: string }) => Promise<TokenBalance>;
  public getICNSData: (args: { subaccount?: string  }) => Promise<{ names: string[]; reverseResolvedName: string | undefined }>;
  public setReverseResolvedName: (args: { name: string, subaccount?: string }) => Promise<string>;
  public sign: (args: { payload: BinaryBlob, subaccount?: string }) => Promise<BinaryBlob>;
  public getContacts: (args: { subaccount?: string }) => Promise<Array<Address>>;
  public addContact: (args: { contact: Address, subaccount?: string }) => Promise<boolean>;
  public deleteContact: (args: { addressName: string, subaccount?: string }) => Promise<boolean>;
  public getAgent: (args?: { subaccount ?: string, host?: string }) => HttpAgent;
  public getBalance: (args: { token: StandardToken, subaccount?: string }) => Promise<TokenBalance>;
  public getTransactions: (args: { subaccount?: string }) => Promise<GetTransactionsResponse>;
  public send: (args: { subaccount?: string, to: string, amount: string, canisterId: string, opts?: TokenInterfaces.SendOpts }) => Promise<TokenInterfaces.SendResponse>;
  public delegateIdentity: (args: { to: Buffer, targets: string[], subaccount?: string }) => Promise<string>;

  public constructor(
    StorageAdapter = new Storage() as KeyringStorage,
    CryptoAdapter = CryptoJS,
    FetchAdapter?: any
  ) {
    this.state = { wallets: {}, mnemonicWalletCount: 0 };
    this.isUnlocked = false;
    this.isInitialized = false;
    this.currentWalletId = uuid();
    this.storage = StorageAdapter;
    this.crypto = CryptoAdapter;
    this.fetch = FetchAdapter;
    this.networkModule = new NetworkModule({
      fetch: this.fetch,
      storage: StorageAdapter,
      onNetworkChange: this.exposeWalletMethods.bind(this),
    });
    this.exposeWalletMethods();
    this.exposeMainWalletMethods();
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

  private exposeMainWalletMethods(): void {
    MAIN_WALLET_METHODS.forEach(method => {
      this[method] = async args => {
        const { ...params } = args || {};
        const mainAccountId = this.getMainAccountId();
        const wallet = await this.getWallet(mainAccountId);
        await wallet.setNetwork(this.networkModule?.network);
        const response = await wallet[method](params);
        await this.updateWallet(wallet);
        return response;
      };
    });
  }

  public getPublicKey = async (subaccount?: string): Promise<PublicKey> => {
    const wallet = await this.getWallet(subaccount);
    return wallet.publicKey;
  };

  // Keyring aux methods
  private getWallet = async (subaccount?: string): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const uuid = (subaccount ?? this.currentWalletId);
    this.validateSubaccount(uuid);
    return this.state?.wallets[uuid];
  };

  private updateWallet = async (wallet: PlugWallet): Promise<void> => {
    await this.checkUnlocked();
    const wallets = this.state.wallets;
    wallets[wallet.walletId] = wallet;
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
  };

  public getWalletIdFromIndex = async (index: number): Promise<String> => {
    if (
      index < 0 ||
      !Number.isInteger(index) ||
      !this.state.walletIds ||
      index >= (this.state.walletIds.length || 0)
    ) {
      throw new Error(ERRORS.INVALID_WALLET_NUMBER);
    }
    return this.state.walletIds[index];
  };

  public init = async (): Promise<void> => {
    const state = (await this.storage.get()) as StorageData;
    this.isUnlocked = !!state?.isUnlocked;
    this.isInitialized = !!state?.isInitialized;
    this.currentWalletId = state?.currentWalletId || this.currentWalletId;
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
    const networkModuleBis = networkModule;
    if (isInitialized && vault) {
      const newVersion = getVersion();
      const _decrypted =
        newVersion !== version
          ? handleStorageUpdate(version, { ...this.decryptState(vault, password), networkModuleBis } )
          : this.decryptState(vault, password);
      const { mnemonic, mnemonicWalletCount, ...decrypted } = _decrypted;
      this.networkModule = new NetworkModule({
        ...(newVersion !== version ?  (_decrypted.networkModule || {}) : networkModule),
        fetch: this.fetch,
        storage: this.storage,
        onNetworkChange: this.exposeWalletMethods.bind(this),
      });
      const walletsArray = Object.values(_decrypted.wallets);
      const wallets = walletsArray.reduce(
        async (walletsAccum, wallet) => ({
          ...walletsAccum,
          [wallet.walletId]: createWallet({
            ...wallet,
            fetch: this.fetch,
            network: this.networkModule.network,
            identity: await IdentityFactory.createIdentity(wallet.type, wallet.keyPair)
          })
        }),
        {}
      );

      this.state = { ...decrypted, wallets, mnemonicWalletCount };
      this.isInitialized = isInitialized;
      this.currentWalletId = newVersion !== version ? (decrypted.currentWalletId || this.currentWalletId) : currentWalletId;
      this.exposeWalletMethods();
      if (newVersion !== version) {
        await this.saveEncryptedState({ wallets, mnemonicWalletCount }, password, mnemonic);
        await this.storage.set({ version: newVersion, currentWalletId: this.currentWalletId });
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


  public importAccountFromPem = async ({
    icon,
    name,
    pem,
  }: ImportFromPemOptions
  ): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const walletId = uuid(); 
    const orderNumber = Object.keys(this.state.wallets).length;
    const { identity, type } = getIdentityFromPem(pem);
    const wallet = createWallet({
      icon,
      name,
      walletId,
      orderNumber,
      fetch: this.fetch,
      network: this.networkModule.network,
      type,
      identity,
    });

    const wallets = { ...this.state.wallets, [walletId]: wallet };
    await this.saveEncryptedState({ wallets }, this.state.password);
    this.state.wallets = wallets;
    return wallet;
  };

  public deleteImportedAccount = async (walletId: string): Promise<void> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const wallets = this.state.wallets

    if (wallets[walletId] && wallets[walletId].type == IDENTITY_TYPES.mnemonic) {
      throw new Error(ERRORS.DELETE_ACCOUNT_ERROR);
    }

    const { [walletId]: deletedWallet, ...maintainedWallets } = wallets

    await this.saveEncryptedState({ wallets: maintainedWallets }, this.state.password);
    this.state.wallets = maintainedWallets;
  };

  public importLedgerAccount = async ({icon, name, path}: ImportFromLedgerOptions): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const walletId = uuid(); 
    const orderNumber = Object.keys(this.state.wallets).length;
    const identity = await LedgerIdentity.create(path);
    const type = IDENTITY_TYPES.ledger;
    const wallet = createWallet({
      icon,
      name,
      walletId,
      orderNumber,
      fetch: this.fetch,
      network: this.networkModule.network,
      type,
      identity,
    });

    const wallets = { ...this.state.wallets, [walletId]: wallet };
    await this.saveEncryptedState({ wallets }, this.state.password);
    this.state.wallets = wallets;
    return wallet;
  }

  // Key Management
  public createPrincipal = async (
    opts?: CreatePrincipalOptions
  ): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const mnemonic = await this.getMnemonic(this.state.password as string);
    const walletId = uuid(); 
    const walletNumber = this.state.mnemonicWalletCount;
    const orderNumber = Object.keys(this.state.wallets).length;
    const { identity } = createAccountFromMnemonic(
      mnemonic,
      walletNumber
    );
    const wallet = createWallet({
      ...opts,
      walletId,
      orderNumber,
      fetch: this.fetch,
      network: this.networkModule.network,
      type: IDENTITY_TYPES.mnemonic,
      identity,
    });
    const wallets = { ...this.state.wallets, [walletId]: wallet };
    await this.saveEncryptedState({ wallets, mnemonicWalletCount: walletNumber + 1 }, this.state.password);
    this.state.wallets = wallets;
    this.state.mnemonicWalletCount = walletNumber + 1;
    return wallet;
  };

  // Key Management
  public setCurrentPrincipal = async (walletId: string): Promise<void> => {
    await this.checkInitialized();
    this.validateSubaccount(walletId);
    this.currentWalletId = walletId;
    await this.storage.set({ currentWalletId: walletId });
  };

  // General
  public getState = async (): Promise<PlugStateStorage> => {
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
    this.state = { wallets: {}, mnemonicWalletCount: 0 };
    await this.storage.set({ isUnlocked: this.isUnlocked });
  };

  // Key Management
  public editPrincipal = async (
    walletId: string,
    { name, emoji }: { name?: string; emoji?: string }
  ): Promise<void> => {
    const wallet = await this.getWallet(walletId);
    if (name) wallet.setName(name);
    if (emoji) wallet.setIcon(emoji);
    await this.updateWallet(wallet);
  };

  private validateSubaccount(subaccount: string): void {
    
    if (
      !this.state.wallets[subaccount]
    ) {
      throw new Error(ERRORS.INVALID_WALLET_NUMBER);
    }
  }

  private checkInitialized = async (): Promise<void> => {
    await this.init();
    if (!this.isInitialized) throw new Error(ERRORS.NOT_INITIALIZED);
  };

  public getPemFile = async (walleId?: string): Promise<string> => {
    const wallet = await this.getWallet(walleId);
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
    const walletId = this.currentWalletId;
    const { identity } = createAccountFromMnemonic(
      mnemonic,
      0
    );
 
    const wallet = createWallet({
      icon,
      name,
      walletId,
      orderNumber: 0,
      fetch: this.fetch,
      network: this.networkModule.network,
      identity: identity,
      type: IDENTITY_TYPES.mnemonic,
    });

    const data = {
      wallets: {[walletId]: wallet.toJSON()},
      password,
      mnemonic,
      mnemonicWalletCount: 1,
    };

    this.isInitialized = true;
    this.currentWalletId = walletId;
    this.state.mnemonicWalletCount = 1;
    await this.storage.clear();
    await this.storage.set({
      isInitialized: true,
      isUnlocked: true,
      currentWalletId: walletId,
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
  private decryptState = (state, password): PlugStateStorage & { mnemonic: string, networkModule?: NetworkModuleParams } =>
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

  // Utils
  private getMainAccountId = (): string => {
    const  { wallets } = this.state;
    const mainAccount = Object.values(wallets).find(
      (wallet) => wallet.orderNumber === 0);

    return mainAccount?.walletId || this.currentWalletId;
  }
}

export default PlugKeyRing;
