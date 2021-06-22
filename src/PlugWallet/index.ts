import { KeyPair, Principal } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { createAccountFromMnemonic } from '../utils/account';

interface PlugWalletArgs {
  name?: string;
  walletNumber: number;
  mnemonic: string;
}

class PlugWallet {
  name: string;

  walletNumber: number;

  accountId: string;

  private identity: Ed25519KeyIdentity;

  constructor({ name, walletNumber, mnemonic }: PlugWalletArgs) {
    this.name = name || 'Main IC Wallet';
    this.walletNumber = walletNumber;
    const { identity, accountId } = createAccountFromMnemonic(
      mnemonic,
      walletNumber
    );
    this.identity = identity;
    this.accountId = accountId;
  }

  get keys(): KeyPair {
    return this.identity.getKeyPair();
  }

  get principal(): Principal {
    return this.identity.getPrincipal();
  }

  public setName(val: string): void {
    this.name = val;
  }

  public toJSON = () => ({
    name: this.name,
    walletNumber: this.walletNumber,
    identity: this.identity.toJSON(),
    accountId: this.accountId,
  });
}

export default PlugWallet;
