import CryptoJS from 'crypto-js';
import { HttpAgent, PublicKey } from '@dfinity/agent';
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
import { ValueType, Address, Error, Response } from '../interfaces/contact_registry';
import NetworkModule from './modules/Network';
import { Balance } from '@psychedelic/dab-js/dist/interfaces/dip_721';

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

  // methods
  public getBalances: (args?: { subaccount?: number }) => Promise<Array<TokenBalance>>;
  public getNFTs: (args?: { subaccount?: number, refresh?: boolean }) => Promise<NFTCollection[] | null>;
  public transferNFT: (args: { subaccount?: number; token: NFTDetails; to: string; standard: string; }) => Promise<NFTCollection[]>;
  public burnXTC: (args?: { to: string; amount: string; subaccount: number; }) => Promise<TokenInterfaces.BurnResult>;
  public registerToken: (args: { canisterId: string; standard?: string; subaccount?: number; image?: string; }) => Promise<Array<TokenBalance>>;
  public removeToken: (args: { canisterId: string; subaccount?: number; }) => Promise<Array<TokenBalance>>;
  public getTokenInfo: (args: { canisterId: string, standard?: string, subaccount?: number }) => Promise<{ token: StandardToken; amount: string }>

  public constructor(
    StorageAdapter = new Storage() as KeyringStorage,
    CryptoAdapter = CryptoJS,
    FetchAdapter?: any,
  ) {
    this.state = { wallets: [] };
    this.isUnlocked = false;
    this.isInitialized = false;
    this.currentWalletId = 0;
    this.storage = StorageAdapter;
    this.crypto = CryptoAdapter;
    this.fetch = FetchAdapter;
    this.networkModule = new NetworkModule();
    this.exposeWalletMethods();
  }

  private exposeWalletMethods(): void {
    const METHODS = ['getNFTs', 'getBalances', 'burnXTC', 'transferNFT', 'registerToken', 'removeToken', 'getTokenInfo'];
    METHODS.forEach(method => {
      this[method] = async (args) => {
        const { subaccount, ...params } = args || {};
        const wallet = await this.getWallet(subaccount);
        const response = await wallet[method](params);
        await this.updateWallet(wallet);
        return response;
      }
    });
  }

  private getWallet = async (subaccount?: number): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const index = (subaccount ?? this.currentWalletId) || 0;
    this.validateSubaccount(index);
    return this.state?.wallets?.[index]; 
  }

  private updateWallet = async (wallet: PlugWallet): Promise<void> => {
    await this.checkUnlocked();
    const wallets = this.state.wallets;
    wallets.splice(wallet.walletNumber, 1, wallet);
    this.state.wallets = wallets;
    await this.saveEncryptedState({ wallets }, this.state.password);
  }

  public init = async (): Promise<void> => {
    const state = (await this.storage.get()) as StorageData;
    this.isUnlocked = !!state?.isUnlocked;
    this.isInitialized = !!state?.isInitialized;
    this.currentWalletId = state?.currentWalletId || 0;
  };

  // Query
  public getPublicKey = async (subaccount?: number): Promise<PublicKey> => {
    const wallet = await this.getWallet(subaccount);
    return wallet.publicKey;
  };

  // Storage get
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

  // Key Management
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

  // Key Management
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

  // Key Management
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

  // Queryish
  public sign = async (
    payload: BinaryBlob,
    subaccount?: number
  ): Promise<BinaryBlob> => {
    const wallet = await this.getWallet(subaccount);
    const signed = await wallet.sign(payload);
    return signed;
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

  public getBalance = async (
    token: StandardToken,
    subaccount?: number
  ): Promise<TokenBalance> => {
    const wallet = await this.getWallet(subaccount);
    return wallet.getTokenBalance(token);
  };

  public getTransactions = async (
    subaccount?: number
  ): Promise<GetTransactionsResponse> => {
    const wallet = await this.getWallet(subaccount)
    return wallet.getTransactions();
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
    const wallet = await this.getWallet(this.currentWalletId || 0);
    return wallet.send(
      to,
      amount,
      canisterId,
      opts
    );
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

  public getICNSData = async (
    walletNumber?: number
  ): Promise<{ names: string[]; reverseResolvedName: string | undefined }> => {
    const wallet = await this.getWallet(walletNumber);
    return wallet.getICNSData();
  };

  public setICNSResolvedName = async (
    name: string,
    walletNumber?: number
  ): Promise<string> => {
    const wallet = await this.getWallet(walletNumber);
    return wallet.setReverseResolvedName(name);
  };

  public getAgent = (walletNumber?: number): HttpAgent => {
    this.checkUnlocked();
    const currentWalletNumber = (walletNumber ?? this.currentWalletId) || 0;
    this.validateSubaccount(currentWalletNumber);
    return this.state.wallets[currentWalletNumber].getAgent();
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

  // Storage
  private saveEncryptedState = async (newState, password): Promise<void> => {
    const stringData = JsonBigInt.stringify({ ...this.state, ...newState });
    const encrypted = this.crypto.AES.encrypt(stringData, password);
    await this.storage.set({ vault: encrypted.toString() });
  };

  // Storage
  private decryptState = (state, password): PlugState =>
    JSON.parse(
      this.crypto.AES.decrypt(state, password).toString(this.crypto.enc.Utf8)
  );

  // Wallet
  public getContacts = async (walletNumber?: number): Promise<Array<Address>> => {
    const wallet = await this.getWallet(walletNumber);
    const contacts = await wallet.getContacts();
    return contacts.map((c) => {
      const value = c.value;
      if (value.hasOwnProperty('PrincipalId')) {
        value['PrincipalId'] = value['PrincipalId'].toText();
      }
      return {
        ...c,
        value
      }
    });
  };

  public addContact = async (
    newContact: Address,
    walletNumber?: number,
  ): Promise<boolean> => {
    const wallet = await this.getWallet(walletNumber);
    const value = newContact.value;
    if (value.hasOwnProperty('PrincipalId')) {
      value['PrincipalId'] = Principal.fromText(value['PrincipalId']);
    }
    const response = await wallet.addContact({
      ...newContact,
      value,
    });

    return response;
  };

  public deleteContact = async (
    addressName: string,
    walletNumber?: number,
  ): Promise<boolean> => {
    const wallet = await this.getWallet(walletNumber);
    return wallet.deleteContact(addressName);
  };
}

export default PlugKeyRing;
