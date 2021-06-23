import CryptoJS from 'crypto-js';

import { ERRORS } from '../errors';
import { GetTransactionsResponse } from '../interfaces/nns_uid';
import PlugWallet from '../PlugWallet';
import { createAccount } from '../utils/account';
import Storage from '../utils/storage';
import mockStore from '../utils/storage/mock';

interface PlugState {
  wallets: Array<PlugWallet>;
  currentWalletId?: number;
  password?: string;
  mnemonic?: string;
}

interface Transactions {
  [key: string]: GetTransactionsResponse;
}
const store = process.env.NODE_ENV === 'test' ? mockStore : new Storage();

class PlugKeyRing {
  private state: PlugState;

  private isUnlocked = false;

  public constructor() {
    this.state = { wallets: [] };
    this.isUnlocked = false;
  }

  public loadFromPersistance = async (password: string): Promise<void> => {
    const state = (await store.get()) as PlugState;
    if (state) {
      const decrypted = this.decryptState(state, password);
      const passwordsMatch = decrypted.password === password;
      if (passwordsMatch) {
        const wallets = decrypted.wallets.map(
          wallet =>
            new PlugWallet({
              ...wallet,
              mnemonic: decrypted.mnemonic as string,
            })
        );
        this.state = { ...decrypted, wallets };
      }
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
    this.checkInitialized();
    this.checkUnlocked();
    const wallet = new PlugWallet({
      mnemonic: this.state.mnemonic as string,
      walletNumber: this.state.wallets.length,
    });
    const wallets = [...this.state.wallets, wallet];
    await this.storeState({ wallets }, this.state.password);
    this.state.wallets = wallets;
    return wallet;
  };

  public setCurrentPrincipal = (wallet: PlugWallet): void => {
    this.checkInitialized();
    this.state.currentWalletId = wallet.walletNumber;
  };

  public getState = async (): Promise<PlugState> => {
    this.checkUnlocked();
    await this.loadFromPersistance(this.state.password as string);
    return this.state;
  };

  public unlock = async (password: string): Promise<boolean> => {
    this.checkInitialized();
    await this.loadFromPersistance(password);
    this.isUnlocked = this.state?.password === password;
    return this.isUnlocked;
  };

  public lock = (): void => {
    this.isUnlocked = false;
    this.state = { wallets: [] };
  };

  public editPrincipal = (
    walletNumber: number,
    { name, emoji }: { name?: string; emoji?: string }
  ): void => {
    this.checkInitialized();
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
    this.storeState({ wallets }, this.state.password);
  };

  public getBalances = async (subAccount?: number): Promise<bigint> => {
    const state = await this.getState();
    if (typeof state.wallets === 'string') return Promise.resolve(BigInt(0));
    if (subAccount !== undefined) {
      return state.wallets[subAccount].getBalance();
    }
    const balances = await Promise.all(
      state.wallets.map(wallet => wallet.getBalance())
    );
    return balances.reduce((a, b) => a + b);
  };

  public getTransactions = async (
    subAccount?: number
  ): Promise<Transactions | undefined> => {
    const state = await this.getState();
    const transactions = {};
    if (typeof state.wallets === 'string') return Promise.resolve(undefined);
    if (subAccount !== undefined) {
      transactions[subAccount] = state.wallets[subAccount].getTransactions();
      return transactions;
    }
    state.wallets.forEach(async wallet => {
      transactions[wallet.walletNumber] = await wallet.getTransactions();
    });

    return transactions;
  };

  private checkInitialized = (): void => {
    if (!this.state.wallets.length) {
      throw new Error(ERRORS.NOT_INITIALIZED);
    }
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
    await this.storeState(data, password);
    await this.loadFromPersistance(password);
    return wallet;
  };

  private storeState = async (newState, password): Promise<void> => {
    const stringData = JSON.stringify({ ...this.state, ...newState });
    const encrypted = CryptoJS.AES.encrypt(stringData, password);
    await store.set(encrypted);
  };

  private decryptState = (state, password): PlugState =>
    JSON.parse(
      CryptoJS.AES.decrypt(state, password).toString(CryptoJS.enc.Utf8)
    );
}

export default PlugKeyRing;
