import CryptoJS from 'crypto-js';

import { ERRORS } from '../errors';
import { GetTransactionsResponse } from '../interfaces/nns_uid';
import PlugWallet from '../PlugWallet';
import { createAccount } from '../utils/account';
import { SendOpts } from '../utils/dfx/ledger/methods';
import Storage from '../utils/storage';
import mockStore from '../utils/storage/mock';

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

  // CHECK WITH JANISON: What if they import the mnemonic in another place and put a different password? wouldn't that create a different account? (check seed derivation)
  public importMnemonic = async ({
    mnemonic,
    password,
  }: {
    mnemonic: string;
    password: string;
  }): Promise<PlugWallet> =>
    this.createAndPersistKeyRing({ mnemonic, password });

  // Assumes the state is already initialized
  public createPrincipal = async (): Promise<PlugWallet> => {
    await this.checkInitialized();
    this.checkUnlocked();
    const wallet = new PlugWallet({
      mnemonic: this.state.mnemonic as string,
      walletNumber: this.state.wallets.length,
    });
    const wallets = [...this.state.wallets, wallet];
    await this.saveEncryptedState({ wallets }, this.state.password);
    this.state.wallets = wallets;
    return wallet;
  };

  public setCurrentPrincipal = async (wallet: PlugWallet): Promise<void> => {
    await this.checkInitialized();
    this.state.currentWalletId = wallet.walletNumber;
  };

  public getState = async (): Promise<PlugState> => {
    await this.checkInitialized();
    this.checkUnlocked();
    return this.state;
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
    if (
      walletNumber < 0 ||
      !Number.isInteger(walletNumber) ||
      walletNumber >= this.state.wallets.length
    ) {
      throw new Error(ERRORS.INVALID_WALLET_NUMBER);
    }
    const wallet = this.state.wallets[walletNumber];
    if (name) wallet.setName(name);
    if (emoji) wallet.setIcon(emoji);
    const { wallets } = this.state;
    wallets.splice(walletNumber, 1, wallet);

    this.state.wallets = wallets;
    this.saveEncryptedState({ wallets }, this.state.password);
  };

  public getBalance = async (subAccount?: number): Promise<bigint> => {
    this.checkUnlocked();
    const index = subAccount || this.state.currentWalletId || 0;
    if (index < 0 || index >= this.state.wallets.length)
      throw new Error(ERRORS.INVALID_WALLET_NUMBER);
    return this.state.wallets[index].getBalance();
  };

  public getTransactions = async (
    subAccount?: number
  ): Promise<GetTransactionsResponse> => {
    this.checkUnlocked();
    const index = subAccount || this.state.currentWalletId || 0;
    if (index < 0 || index >= this.state.wallets.length)
      throw new Error(ERRORS.INVALID_WALLET_NUMBER);
    return this.state.wallets[index].getTransactions();
  };

  private checkInitialized = async (): Promise<void> => {
    await this.init();
    if (!this.isInitialized) throw new Error(ERRORS.NOT_INITIALIZED);
  };

  public sendICP = async (
    to: string,
    amount: bigint,
    opts?: SendOpts
  ): Promise<bigint> => {
    this.checkUnlocked();
    const currentWalletNumber = this.state.currentWalletId;
    return this.state.wallets[currentWalletNumber || 0].sendICP(
      to,
      amount,
      opts
    );
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
    const encrypted = CryptoJS.AES.encrypt(stringData, password);
    await store.set({ vault: encrypted });
  };

  private decryptState = (state, password): PlugState =>
    JSON.parse(
      CryptoJS.AES.decrypt(state, password).toString(CryptoJS.enc.Utf8)
    );
}

export default PlugKeyRing;
