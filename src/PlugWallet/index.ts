import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';

import { ERRORS } from '../errors';
import { StandardToken, TokenBalance } from '../interfaces/token';
import { validateCanisterId, validateToken } from '../PlugKeyRing/utils';
import { createAccountFromMnemonic } from '../utils/account';
import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';
import { createAgent, createLedgerActor, createTokenActor } from '../utils/dfx';
import { SendOpts } from '../utils/dfx/ledger/methods';
import { getTransactions, GetTransactionsResponse } from '../utils/dfx/rosetta';

interface PlugWalletArgs {
  name?: string;
  walletNumber: number;
  mnemonic: string;
  icon?: string;
  registeredTokens?: Array<StandardToken>;
}

interface JSONWallet {
  name: string;
  walletNumber: number;
  principal: string;
  accountId: string;
  icon?: string;
  registeredTokens?: Array<StandardToken>;
}

class PlugWallet {
  name: string;

  icon?: string;

  walletNumber: number;

  accountId: string;

  principal: string;

  registeredTokens: Array<StandardToken>;

  private identity: Secp256k1KeyIdentity;

  constructor({ name, icon, walletNumber, mnemonic }: PlugWalletArgs) {
    this.name = name || 'Main IC Wallet';
    this.icon = icon;
    this.walletNumber = walletNumber;
    this.registeredTokens = [];
    const { identity, accountId } = createAccountFromMnemonic(
      mnemonic,
      walletNumber
    );
    this.identity = identity;
    this.accountId = accountId;
    this.principal = identity.getPrincipal().toText();
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

  public registerToken = async (
    canisterId: string
  ): Promise<Array<StandardToken>> => {
    const { secretKey } = this.identity.getKeyPair();
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const tokenActor = await createTokenActor(canisterId, secretKey);
    const metadata = await tokenActor.meta();
    if (!validateToken(metadata)) {
      throw new Error(ERRORS.TOKEN_NOT_SUPPORTED);
    }
    const tokenDescriptor = { ...metadata, canisterId };
    const newTokens = [...this.registeredTokens, tokenDescriptor];
    this.registeredTokens = newTokens;
    return newTokens;
  };

  public toJSON = (): JSONWallet => ({
    name: this.name,
    walletNumber: this.walletNumber,
    principal: this.identity.getPrincipal().toText(),
    accountId: this.accountId,
    icon: this.icon,
    registeredTokens: this.registeredTokens,
  });

  public getBalance = async (): Promise<Array<TokenBalance>> => {
    const { secretKey } = this.identity.getKeyPair();
    const balances: Array<TokenBalance> = [];
    // Get ICP Balance
    const agent = await createAgent({ secretKey });
    const ledger = await createLedgerActor(agent);
    const icpBalance = await ledger.getBalance(this.accountId);
    balances.push({ name: 'ICP', symbol: 'ICP', amount: icpBalance });
    // Get Custom Token Balances
    this.registeredTokens.forEach(async token => {
      const tokenActor = await createTokenActor(token.canisterId, secretKey);

      console.log('fetching balances', balances);
      const tokenBalance = await tokenActor.balance([
        this.identity.getPrincipal(),
      ]);
      balances.push({
        name: token.name,
        symbol: token.symbol,
        amount: tokenBalance,
      });
    });
    console.log('fetched balances', balances);
    return balances;
  };

  public getTokenInfo = async (
    canisterId
  ): Promise<{ token: StandardToken; amount: bigint }> => {
    const { secretKey } = this.identity.getKeyPair();
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const tokenActor = await createTokenActor(canisterId, secretKey);
    const metadata = await tokenActor.meta();
    if (!validateToken(metadata)) {
      throw new Error(ERRORS.TOKEN_NOT_SUPPORTED);
    }
    const meta = await tokenActor.meta();
    const tokenBalance = await tokenActor.balance([
      this.identity.getPrincipal(),
    ]);
    return { token: { ...meta, canisterId }, amount: tokenBalance };
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

  public get pemFile(): string {
    return this.identity.getPem();
  }
}

export default PlugWallet;
