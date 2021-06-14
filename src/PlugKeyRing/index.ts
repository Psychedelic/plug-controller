const CryptoJS = require('crypto-js');

import { Console, timeStamp } from "console";
import { ERRORS } from "../errors";
import PlugWallet from "../PlugWallet";
import { createAccount } from "../utils/account";
import Storage from "../utils/storage";
import mockStore from "../utils/storage/mock";

interface PlugState {
    wallets: Array<PlugWallet>,
    currentWalletId?: number,
    password?: string,
    mnemonic?: string,
}

const store = process.env.NODE_ENV === 'test' ? mockStore : new Storage();

class PlugKeyRing {
    private state: PlugState;
    private isUnlocked = false;

    public constructor () {
        this.state = { wallets: [] };
        this.isUnlocked = false;
    }

    public loadFromPersistance = async (password: string) => {
        const state = await store.get() as PlugState;
        if (state) {
            const decrypted = this.decryptState(state, password);
            const passwordsMatch = decrypted.password === password;
            if (passwordsMatch) {
                const wallets = decrypted.wallets.map(wallet => new PlugWallet({ ...wallet, mnemonic: decrypted.mnemonic, password }));
                this.state = { ...decrypted, wallets };
            } 
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
        this.checkUnlocked();
        const wallet = new PlugWallet({ mnemonic: this.state.mnemonic!, walletId: this.state.wallets.length });
        const wallets = [...this.state.wallets, wallet];
        await this.storeState({ wallets }, this.state.password);
        this.state.wallets = wallets;
        return wallet;
    }

    public setCurrentPrincipal = (wallet: PlugWallet) => {
        this.checkInitialized();
        this.state.currentWalletId = wallet.walletId
    }

    public getState = async () => {
        this.checkUnlocked();
        await this.loadFromPersistance(this.state.password!);
        return this.state;
    }

    public unlock = async (password: string) => {
        this.checkInitialized();
        await this.loadFromPersistance(password);
        this.isUnlocked = this.state?.password === password;
        return this.isUnlocked;
    };

    public lock = () => {
        this.isUnlocked = false;
        this.state = { wallets: [] };
    }

    public renamePrincipal = (walletId: number, name: string) => {
        this.checkInitialized();
        this.checkUnlocked();
        if (walletId < 0 || !Number.isInteger(walletId) || walletId >= this.state.wallets.length) {
            throw new Error(ERRORS.INVALID_WALLET_NUMBER);
        }
        const wallet = this.state.wallets[walletId];
        wallet.setName(name);
        const wallets = this.state.wallets;
        wallets.splice(walletId, 1, wallet);

        this.state.wallets = wallets;
        this.storeState({ wallets }, this.state.password);
    }

    private checkInitialized = () => {
        if (!this.state.wallets.length) { 
            throw new Error(ERRORS.NOT_INITIALIZED);
        }
    }

    private checkUnlocked = () => {
        if(!this.isUnlocked) {
            throw new Error(ERRORS.STATE_LOCKED);
        }
    }

    private createAndPersistKeyRing = async ({ mnemonic, password }) => {
        if (!password) throw new Error(ERRORS.PASSWORD_REQUIRED);
        const wallet = new PlugWallet({ mnemonic, walletId: 0 });
        const data = {
            wallets: [wallet.toJSON()],
            currentWalletId: 0,
            password,
            mnemonic
        }
        await this.storeState(data, password);
        await this.loadFromPersistance(password);
        return wallet;
    }

    private storeState = async (newState, password) => {
        const stringData = JSON.stringify({...this.state, ...newState });
        const encrypted = CryptoJS.AES.encrypt(stringData, password);
        await store.set(encrypted)
    }

    private decryptState = (state, password) => JSON.parse(CryptoJS.AES.decrypt(state, password).toString(CryptoJS.enc.Utf8));
}

export default PlugKeyRing;