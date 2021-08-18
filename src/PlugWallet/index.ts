import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';

import { ERRORS } from '../errors';
import { StandardToken, TokenBalance } from '../interfaces/token';
import { validateCanisterId } from '../PlugKeyRing/utils';
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

  constructor({
    name,
    icon,
    walletNumber,
    mnemonic,
    registeredTokens,
  }: PlugWalletArgs) {
    this.name = name || 'Main IC Wallet';
    this.icon = icon;
    this.walletNumber = walletNumber;
    this.registeredTokens = registeredTokens || [];
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

  public registerToken = async (canisterId: string): Promise<any> => {
    const { secretKey } = this.identity.getKeyPair();
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const tokenActor = await createTokenActor(canisterId, secretKey);

    const extensions = await tokenActor.extensions();

    if (!extensions.includes('@ext/common')) {
      throw new Error(ERRORS.TOKEN_NOT_SUPPORTED);
    }

    const metadataResult = await tokenActor.metadata(canisterId);

    if (!('ok' in metadataResult)) {
      throw new Error(Object.keys(metadataResult.error)[0]);
    }

    const metadata = metadataResult.ok;

    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const tokenDescriptor = { ...metadata.fungible, canisterId };
    const newTokens = [...this.registeredTokens, tokenDescriptor];
    const unique = [
      ...new Map(newTokens.map(token => [token.symbol, token])).values(),
    ];
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

  public getBalance = async (): Promise<Array<TokenBalance>> => {
    const { secretKey } = this.identity.getKeyPair();
    // Get ICP Balance
    const agent = await createAgent({ secretKey });
    const ledger = await createLedgerActor(agent);
    const icpBalance = await ledger.getBalance(this.accountId);
    // Get Custom Token Balances
    const tokenBalances = await Promise.all(
      this.registeredTokens.map(async token => {
        const tokenActor = await createTokenActor(token.canisterId, secretKey);
        const tokenBalance = await tokenActor.balance({
          user: { principal: this.identity.getPrincipal() },
          token: token.canisterId,
        });
        if (!('ok' in tokenBalance)) {
          throw new Error(Object.keys(tokenBalance.error)[0]);
        }
        return {
          name: token.name,
          symbol: token.symbol,
          amount: tokenBalance.ok,
          canisterId: token.canisterId,
        };
      })
    );
    return [
      { name: 'ICP', symbol: 'ICP', amount: icpBalance, canisterId: null },
      ...tokenBalances,
    ];
  };

  public getTokenInfo = async (canisterId: string) => {
    const { secretKey } = this.identity.getKeyPair();
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const tokenActor = await createTokenActor(canisterId, secretKey);
    const extensions = await tokenActor.extensions();
    if (!extensions.includes('@ext/common')) {
      throw new Error(ERRORS.TOKEN_NOT_SUPPORTED);
    }
    const metadataResult = await tokenActor.metadata(canisterId);
    if (!('ok' in metadataResult)) {
      throw new Error(Object.keys(metadataResult.error)[0]);
    }
    const metadata = metadataResult.ok;
    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const tokenBalance = await tokenActor.balance({
      user: { principal: this.identity.getPrincipal() },
      token: canisterId,
    });
    const token = { ...metadata.fungible, canisterId };
    if (!('ok' in tokenBalance)) {
      throw new Error(Object.keys(tokenBalance.error)[0]);
    }
    return { token, amount: tokenBalance?.ok };
  };

  public getTransactions = async (): Promise<GetTransactionsResponse> => {
    return getTransactions(this.accountId);
  };

  public send = async (
    to: string,
    amount: bigint,
    canisterId?: string,
    opts?: SendOpts
  ): Promise<bigint> => {
    const { secretKey } = this.identity.getKeyPair();
    console.log('controller sending');
    if (canisterId) {
      console.log('SENDING CUSTOM TOKEN');
      const tokenActor = await createTokenActor(canisterId, secretKey);
      const dummyMemmo = new Array(32).fill(0);
      const data = {
        to: { principal: Principal.fromText(to) },
        from: { principal: this.identity.getPrincipal() },
        amount: BigInt(amount),
        token: canisterId,
        memo: dummyMemmo,
        notify: false,
        subaccount: [],
        fee: BigInt(1),
      };
      const result = await tokenActor.transfer(data);
      console.log('sent to canister', canisterId, result);
      if (typeof result === 'bigint') {
        return result;
      }

      throw new Error(Object.keys(result)[0]);
    } else {
      console.log('SENDING ICP TOKEN');
      const agent = await createAgent({ secretKey });
      const ledger = await createLedgerActor(agent);
      return ledger.sendICP({ to, amount, opts });
    }
  };

  public get publicKey(): PublicKey {
    return this.identity.getKeyPair().publicKey;
  }

  public get pemFile(): string {
    return this.identity.getPem();
  }
}

export default PlugWallet;
