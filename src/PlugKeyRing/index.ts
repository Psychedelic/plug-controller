import PlugWallet from "../PlugWallet";
import { createAccount } from "../utils/account";
import Storage from '../utils/storage';
import StorageMock from "../utils/storage/mock";

interface PlugState {
    wallets: Array<PlugWallet> | string,
    currentWalletId?: number,
    password?: string,
    mnemonic?: string,
}

const store = process.env.NODE_ENV === 'test' ? new StorageMock() : new Storage();

class PlugKeyRing {
    private state: PlugState;
    private isUnlocked = false;

    public constructor () {
        this.state = { wallets: [] };
        this.isUnlocked = false;
    }

    public load = async () => {
        const state = await store.get() as PlugState;
        if (state) {
            const jsonWallets = JSON.parse(state.wallets as string);
            const wallets = jsonWallets.map(wallet => new PlugWallet({ ...wallet, mnemonic: state.mnemonic, password: state.password }));
            this.state = { ...state, wallets };
        }
    }

    public create = async ({ password = '' }: { password: string }) => {
        const { mnemonic } = createAccount(password);
        const wallet = await this.createAndPersistKeyRing({ mnemonic, password });
        return { wallet, mnemonic };
    }

    // CHECK WITH JANISON: What if they import the mnemonic in another place and put a different password? wouldn't that create a different account? (check seed derivation)
    public importMnemonic = async ({ mnemonic, password } : {mnemonic: string, password: string}) => await this.createAndPersistKeyRing({ mnemonic, password });

    // Assumes the state is already initialized
    public createPrincipal = async () => {
        this.checkInitialized();
        const wallet = new PlugWallet({ mnemonic: this.state.mnemonic!, walletNumber: this.state.wallets.length, password: this.state.password! });
        const wallets = JSON.stringify([...this.state.wallets, wallet]);
        await store.set({ ...this.state, wallets });
        return wallet;
    }

    public setCurrentPrincipal = (wallet: PlugWallet) => {
        this.checkInitialized();
        this.state.currentWalletId = wallet.walletNumber
    }

    public getState = async () => {
        if(!this.isUnlocked) {
            throw new Error('The state is locked');
        }
        await this.load();
        return this.state;
    }

    public unlock = (password: string) => {
        this.checkInitialized();
        const passwordsMatch = this.state.password === password;
        this.isUnlocked = passwordsMatch;
        return passwordsMatch;
    };

    public lock = () => {
        this.isUnlocked = false;
    }

    private checkInitialized = () => {
        if (!this.state.wallets.length) { 
            throw new Error('Plug must be initialized');
        }
    }

    private createAndPersistKeyRing = async ({ mnemonic, password }) => {
        if (!password) throw new Error('A password is required');
        const wallet = new PlugWallet({ mnemonic, walletNumber: 0, password });
        const data = {
            wallets: JSON.stringify([wallet.toJSON()]),
            currentWalletId: 0,
            password,
            mnemonic
        }
        await store.set(data);
        await this.load();
        return wallet;
    }
}

export default PlugKeyRing;