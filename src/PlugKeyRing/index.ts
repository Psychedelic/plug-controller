import PlugWallet from '../PlugWallet';
import { createAccount } from '../utils/account';
import Storage from '../utils/storage';
import StorageMock from '../utils/storage/mock';

interface PlugState {
  wallets: Array<PlugWallet>;
  currentWalletId?: number;
  password?: string;
  mnemonic?: string;
}

const store =
  process.env.NODE_ENV === 'test' ? new StorageMock() : new Storage();

class PlugKeyRing {
  private state: PlugState;

  private isUnlocked = false;

  public constructor() {
    this.state = { wallets: [] };
    this.isUnlocked = false;
  }

  public init = async (): Promise<void> => {
    const state = (await store.get()) as PlugState;
    if (state) this.state = state;
  };

  public create = async ({
    password = '',
  }: {
    password: string;
  }): Promise<PlugWallet> => {
    const { mnemonic } = createAccount(password);
    const defaultWallet = await this.createAndPersistWallet({
      mnemonic,
      password,
    });
    return defaultWallet;
  };

  // CHECK WITH JANISON: What if they import the mnemonic in another place and put a different password? wouldn't that create a different account? (check seed derivation)
  public importMnemonic = async ({
    mnemonic,
    password,
  }: {
    mnemonic: string;
    password: string;
  }): Promise<PlugWallet> =>
    this.createAndPersistWallet({ mnemonic, password });

  // Assumes the state is already initialized
  public createPrincipal = async (): Promise<PlugWallet> => {
    this.checkInitialized();
    const wallet = new PlugWallet({
      mnemonic: this.state.mnemonic as string,
      walletNumber: this.state.wallets.length,
      password: this.state.password as string,
    });
    await store.set({
      ...this.state,
      wallets: [...this.state.wallets, wallet],
    });
    return wallet;
  };

  public setCurrentPrincipal = (wallet: PlugWallet): void => {
    this.checkInitialized();
    this.state.currentWalletId = wallet.walletNumber;
  };

  public getState = async (): Promise<PlugState> => {
    if (!this.isUnlocked) {
      throw new Error('The state is locked');
    }
    return store.get();
  };

  public unlock = (password: string): boolean => {
    this.checkInitialized();
    const passwordsMatch = this.state.password === password;
    this.isUnlocked = passwordsMatch;
    return passwordsMatch;
  };

  public lock = (): void => {
    this.isUnlocked = false;
  };

  private checkInitialized = (): void => {
    if (!this.state?.wallets?.length) {
      throw new Error('Plug must be initialized');
    }
  };

  private createAndPersistWallet = async ({
    mnemonic,
    password,
  }): Promise<PlugWallet> => {
    if (!password) throw new Error('A password is required');
    const wallet = new PlugWallet({ mnemonic, walletNumber: 0, password });
    const data = {
      wallets: [wallet],
      currentWalletId: 0,
      password,
      mnemonic,
    };
    await store.set(data);
    await this.init();
    return wallet;
  };
}

export default PlugKeyRing;
