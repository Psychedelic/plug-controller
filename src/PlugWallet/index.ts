import { Ed25519KeyIdentity } from "@dfinity/identity";
import { createAccountFromMnemonic } from "../utils/account";

interface PlugWalletArgs {
    name?: string;
    walletId: number;
    mnemonic: string;
}

class PlugWallet {
    name: string;
    walletId: number;
    accountId: string;
    private _identity: Ed25519KeyIdentity;
    
    constructor ({ name, walletId, mnemonic }: PlugWalletArgs) {
        this.name = name || 'Main IC Wallet'
        this.walletId = walletId;
        const { identity, accountId } = createAccountFromMnemonic(mnemonic, walletId);
        this._identity = identity;
        this.accountId = accountId;
    }
    get keys() {
        return this._identity.getKeyPair();
    }
    get principal() {
        return this._identity.getPrincipal();
    }

    public setName(val: string) {
        this.name = val;
    }

    public toJSON = ()  => ({
        name: this.name,
        walletId: this.walletId,
        identity: this._identity.toJSON(),
        accountId: this.accountId
    });
}

export default PlugWallet;