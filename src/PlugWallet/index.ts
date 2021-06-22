import { Ed25519KeyIdentity } from '@dfinity/identity';
import { createAccountFromMnemonic } from '../utils/account';

interface PlugWalletArgs {
  name?: string;
  walletNumber: number;
  mnemonic: string;
  password: string;
}

class PlugWallet {
  name: string;

  walletNumber: number;

  private _identity: Ed25519KeyIdentity;

  private _accountId: string;

  constructor({ name, walletNumber, mnemonic, password }: PlugWalletArgs) {
    this.name = name || 'Main IC Wallet';
    this.walletNumber = walletNumber;
    const { identity, accountId } = createAccountFromMnemonic(
      mnemonic,
      walletNumber,
      password
    );
    this._identity = identity;
    this._accountId = accountId;
  }

  get keys() {
    return this._identity.getKeyPair();
  }

  get principal() {
    return this._identity.getPrincipal();
  }
}

export default PlugWallet;
