import { Principal } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';

import { createAccountFromMnemonic } from '../utils/account';
import { createAgent, createLedgerActor } from '../utils/dfx';
import { SendOpts } from '../utils/dfx/ledger/methods';
import { getTransactions, GetTransactionsResponse } from '../utils/dfx/rosetta';

interface PlugWalletArgs {
  name?: string;
  walletNumber: number;
  mnemonic: string;
  icon?: string;
}

interface JSONWallet {
  name: string;
  walletNumber: number;
  principalId: string;
  accountId: string;
  icon?: string;
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

  get principal(): Principal {
    return this.identity.getPrincipal();
  }

  public setName(val: string): void {
    this.name = val;
  }

  public setIcon(val: string): void {
    this.icon = val;
  }

  public toJSON = (): JSONWallet => ({
    name: this.name,
    walletNumber: this.walletNumber,
    principalId: this.identity.getPrincipal().toText(),
    accountId: this.accountId,
    icon: this.icon,
  });

  public getBalance = async (): Promise<bigint> => {
    const agent = await createAgent({
      secretKey: this.identity.getKeyPair().secretKey as Uint8Array,
    });
    const ledger = await createLedgerActor(agent);

    return ledger.getBalance(this.accountId);
  };

  public getTransactions = async (): Promise<GetTransactionsResponse> => {
    return getTransactions(this.accountId);
  };

  public sendICP = async (
    to: string,
    amount: bigint,
    opts?: SendOpts
  ): Promise<bigint> => {
    const agent = await createAgent({
      secretKey: this.identity.getKeyPair().secretKey as Uint8Array,
    });
    const ledger = await createLedgerActor(agent);
    return ledger.sendICP({ to, amount, opts });
  };
}

export default PlugWallet;
