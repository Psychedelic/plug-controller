import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';

import {
  createAccountFromMnemonic,
  createAccountFromPem,
  createAccountFromPrivateKey,
  verifyMnemonic,
} from '../utils/account';
import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';
import { createAgent, createLedgerActor } from '../utils/dfx';
import { SendOpts } from '../utils/dfx/ledger/methods';
import { getTransactions, GetTransactionsResponse } from '../utils/dfx/rosetta';

interface PlugWalletArgs {
  identity: Secp256k1KeyIdentity;
  accountId: string;
  walletNumber: number;
  name?: string;
  icon?: string;
  mnemonic?: string;
}

interface PlugWalletArgsFromPem {
  pem: string;
  walletNumber: number;
  name?: string;
  icon?: string;
}

interface PlugWalletArgsFromMnemonic {
  mnemonic: string;
  walletNumber: number;
  name?: string;
  icon?: string;
}

interface PlugWalletArgsFromPrivateKey {
  privateKey: string;
  walletNumber: number;
  name?: string;
  icon?: string;
}

interface JSONWallet {
  name: string;
  walletNumber: number;
  principal: string;
  accountId: string;
  icon?: string;
}

class PlugWallet {
  name: string;

  icon?: string;

  walletNumber: number;

  accountId: string;

  principal: string;

  public identity: Secp256k1KeyIdentity;

  constructor({
    name,
    icon,
    walletNumber,
    identity,
    accountId,
  }: PlugWalletArgs) {
    this.name = name || 'Main IC Wallet';
    this.icon = icon;
    this.walletNumber = walletNumber;
    this.identity = identity;
    this.accountId = accountId;
    this.principal = identity.getPrincipal().toText();
  }

  public static fromPem({
    pem,
    name,
    walletNumber,
    icon,
  }: PlugWalletArgsFromPem): PlugWallet {
    const { identity, accountId } = createAccountFromPem(pem, walletNumber);
    return new PlugWallet({
      name,
      icon,
      walletNumber,
      identity,
      accountId,
    });
  }

  public static fromMnemonic({
    mnemonic,
    name,
    walletNumber,
    icon,
  }: PlugWalletArgsFromMnemonic): PlugWallet {
    const { identity, accountId } = createAccountFromMnemonic(
      mnemonic,
      walletNumber
    );
    return new PlugWallet({
      name,
      icon,
      walletNumber,
      identity,
      accountId,
    });
  }

  public static fromPrivateKey({
    privateKey,
    name,
    walletNumber,
    icon,
  }: PlugWalletArgsFromPrivateKey): PlugWallet {
    const { identity, accountId } = createAccountFromPrivateKey(
      privateKey,
      walletNumber
    );
    return new PlugWallet({
      name,
      icon,
      walletNumber,
      identity,
      accountId,
    });
  }

  public setName(val: string): void {
    this.name = val;
  }

  public async sign(payload: BinaryBlob): Promise<BinaryBlob> {
    return this.identity.sign(payload);
  }

  public setIcon(val: string): void {
    this.icon = val;
  }

  public toJSON = (): JSONWallet => ({
    name: this.name,
    walletNumber: this.walletNumber,
    principal: this.identity.getPrincipal().toText(),
    accountId: this.accountId,
    icon: this.icon,
  });

  public getBalance = async (): Promise<bigint> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
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
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const ledger = await createLedgerActor(agent);
    return ledger.sendICP({ to, amount, opts });
  };

  public get publicKey(): PublicKey {
    return this.identity.getKeyPair().publicKey;
  }
}

export default PlugWallet;
