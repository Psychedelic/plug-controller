import { Principal } from "@dfinity/agent";
import { createAccount } from "./modules/account";
import PlugWallet from "./plugWallet";
import Storage from './modules/storage';

class PlugKeyRing {
    _wallets: Array<PlugWallet>;
    mnemonic: string;
    private _currentWallet: number;
    private _password: string;
    
    constructor({ password }: { password: string }) {
        const { mnemonic } = createAccount(password);
        const defaultWallet = new PlugWallet({ mnemonic, walletNumber: 0, password });
        this._wallets = [defaultWallet];
        this.mnemonic = mnemonic;
        // TODO: Save mnemonic and password to the vault
    }
    
    public createPrincipal = () => {
        const wallet = new PlugWallet({ mnemonic: this.mnemonic, walletNumber: this._wallets.length, password: this._password });
        this._wallets = [...this._wallets, wallet];
        return wallet;
    };

    public importMnemonic(seedphrase: string, password: string) {
        this.mnemonic = seedphrase;
        const wallet = new PlugWallet({ mnemonic: seedphrase, walletNumber: 0, password });
        this._wallets = [wallet];
        return wallet;
    };

    public setCurrentPrincipal = (wallet: PlugWallet) => {
        this._currentWallet = wallet.walletNumber
    };

    get wallets() {
        return this._wallets;
    }

    get currentWallet () {
        return this._wallets[this._currentWallet];
    }
}

export default PlugKeyRing;