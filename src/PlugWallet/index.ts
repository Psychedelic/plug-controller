import { KeyPair, Principal } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { createAccountFromMnemonic } from '../utils/account';

interface PlugWalletArgs {
  name?: string;
  icon?: string;
  walletNumber: number;
  mnemonic: string;
}

class PlugWallet {
  name: string;

  icon?: string;

  walletNumber: number;

  accountId: string;

  private identity: Ed25519KeyIdentity;

  constructor({ name, icon, walletNumber, mnemonic }: PlugWalletArgs) {
    this.name = name || 'Main IC Wallet';
    this.icon = icon;
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

  public setIcon(val: string): void {
    this.icon = val;
  }

  public toJSON = () => ({
    name: this.name,
    walletNumber: this.walletNumber,
    identity: this.identity.toJSON(),
    accountId: this.accountId,
    icon: this.icon,
  });
}

export default PlugWallet;
