import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';

import { ERRORS } from '../errors';
import { StandardToken, TokenBalance } from '../interfaces/ext';
import { validateCanisterId } from '../PlugKeyRing/utils';
import { createAccountFromMnemonic } from '../utils/account';
import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';
import { createAgent, createLedgerActor } from '../utils/dfx';
import { createTokenActor, SendResponse } from '../utils/dfx/token';
import { SendOpts } from '../utils/dfx/ledger/methods';
import { getTransactions, GetTransactionsResponse } from '../utils/dfx/rosetta';
import TOKENS from '../constants/tokens';
import { uniqueByObjKey } from '../utils/array';

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

  constructor({
    name,
    icon,
    walletNumber,
    mnemonic,
    registeredTokens = [],
  }: PlugWalletArgs) {
    this.name = name || 'Account 1';
    this.icon = icon;
    this.walletNumber = walletNumber;
    this.registeredTokens = uniqueByObjKey(
      [...registeredTokens, TOKENS.XTC],
      'symbol'
    ) as StandardToken[];
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
  ): Promise<StandardToken[]> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });

    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }

    const tokenActor = await createTokenActor(canisterId, agent);

    const metadata = await tokenActor.getMetadata();

    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const tokenDescriptor = { ...metadata.fungible, canisterId };
    const newTokens = [...this.registeredTokens, tokenDescriptor];
    const unique = uniqueByObjKey(newTokens, 'symbol') as StandardToken[];
    this.registeredTokens = unique;
    return unique;
  };

  public toJSON = (): JSONWallet => ({
    name: this.name,
    walletNumber: this.walletNumber,
    principal: this.identity.getPrincipal().toText(),
    accountId: this.accountId,
    icon: this.icon,
    registeredTokens: this.registeredTokens,
  });

  public burnXTC = async (to: string, amount: bigint) => {
    if (!validateCanisterId(to)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const xtcActor = await createTokenActor(to, agent);
    const burnResult = await xtcActor.burnXTC({
      to: Principal.fromText(to),
      amount,
    });
    return burnResult;
  };

  public getBalance = async (): Promise<Array<TokenBalance>> => {
    const { secretKey } = this.identity.getKeyPair();
    // Get ICP Balance
    const agent = await createAgent({ secretKey });
    const ledger = await createLedgerActor(agent);
    const icpBalance = await ledger.getBalance(this.accountId);
    // Add XTC if it was not in the first place (backwards compatibility)
    if (
      !this.registeredTokens.some(
        token => token.canisterId === TOKENS.XTC.canisterId
      )
    ) {
      this.registeredTokens.push(TOKENS.XTC);
    }
    // Get Custom Token Balances
    const tokenBalances = await Promise.all(
      this.registeredTokens.map(async token => {
        const tokenActor = await createTokenActor(token.canisterId, agent);
        const tokenBalance = await tokenActor.getBalance(
          this.identity.getPrincipal()
        );

        return {
          name: token.name,
          symbol: token.symbol,
          amount: tokenBalance,
          canisterId: token.canisterId,
        };
      })
    );
    return [
      { name: 'ICP', symbol: 'ICP', amount: icpBalance, canisterId: null },
      ...tokenBalances,
    ];
  };

  public getTokenInfo = async (
    canisterId: string
  ): Promise<{ token: StandardToken; amount: bigint }> => {
    const { secretKey } = this.identity.getKeyPair();
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const agent = await createAgent({ secretKey });
    const tokenActor = await createTokenActor(canisterId, agent);

    const metadataResult = await tokenActor.getMetadata();

    const metadata = metadataResult;
    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const tokenBalance = await tokenActor.getBalance(
      this.identity.getPrincipal()
    );
    const token = { ...metadata.fungible, canisterId };

    return { token, amount: tokenBalance };
  };

  public getTransactions = async (): Promise<GetTransactionsResponse> => {
    return getTransactions(this.accountId);
  };

  public send = async (
    to: string,
    amount: bigint,
    canisterId?: string,
    opts?: SendOpts
  ): Promise<SendResponse> => {
    return canisterId
      ? this.sendCustomToken(to, amount, canisterId)
      : { height: await this.sendICP(to, amount, opts) };
  };

  public get publicKey(): PublicKey {
    return this.identity.getKeyPair().publicKey;
  }

  public get pemFile(): string {
    return this.identity.getPem();
  }

  private async sendICP(
    to: string,
    amount: bigint,
    opts?: SendOpts
  ): Promise<bigint> {
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const ledger = await createLedgerActor(agent);
    return ledger.sendICP({ to, amount, opts });
  }

  private async sendCustomToken(
    to: string,
    amount: bigint,
    canisterId: string
  ): Promise<SendResponse> {
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const tokenActor = await createTokenActor(canisterId, agent);

    const result = await tokenActor.send(
      to,
      this.identity.getPrincipal().toString(),
      amount
    );

    return result;
  }
}

export default PlugWallet;
