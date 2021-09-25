import { PublicKey } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  getAllUserNFTs,
  getNFTActor,
  NFTCollection,
  NFTDetails,
} from '@psychedelic/dab-js';
import randomColor from 'random-color';
import { Secp256k1KeyIdentity } from '@dfinity/identity';

import { ERRORS } from '../errors';
import { StandardToken } from '../interfaces/ext';
import { validateCanisterId, validatePrincipalId } from '../PlugKeyRing/utils';
import { createAccountFromMnemonic } from '../utils/account';
import { createAgent, createLedgerActor } from '../utils/dfx';
import { createTokenActor, SendResponse } from '../utils/dfx/token';
import { SendOpts } from '../utils/dfx/ledger/methods';
import {
  getICPTransactions,
  GetTransactionsResponse,
} from '../utils/dfx/history/rosetta';
import { TOKENS, DEFAULT_ASSETS } from '../constants/tokens';
import { uniqueByObjKey } from '../utils/array';
import {
  getXTCTransactions,
  requestCacheUpdate,
} from '../utils/dfx/history/xtcHistory';

import { ConnectedApp } from '../interfaces/account';
import { getPem } from '../utils/crypto/identity';

export interface TokenBalance {
  name: string;
  symbol: string;
  amount: string;
  canisterId: string | null;
}
interface PlugWalletArgs {
  name?: string;
  walletNumber: number;
  mnemonic: string;
  icon?: string;
  registeredTokens?: Array<StandardToken>;
  connectedApps?: Array<ConnectedApp>;
  assets?: Array<TokenBalance>;
  collections?: Array<NFTCollection>;
}

interface JSONWallet {
  name: string;
  walletNumber: number;
  principal: string;
  accountId: string;
  icon?: string;
  registeredTokens: Array<StandardToken>;
  connectedApps: Array<ConnectedApp>;
  assets?: Array<{
    name: string;
    symbol: string;
    amount: number;
    canisterId: string | null;
  }>;
  nftCollections?: Array<{
    name: string;
    canisterId: string;
    standard: string;
    tokens: Array<{
      index: number;
      canister: string;
      id?: string;
      name?: string;
      url: string;
      metadata: any;
      collection?: string;
    }>;
  }>;
}

class PlugWallet {
  name: string;

  icon?: string;

  walletNumber: number;

  accountId: string;

  principal: string;

  registeredTokens: Array<StandardToken>;

  connectedApps: Array<ConnectedApp>;

  assets: Array<TokenBalance>;

  collections: Array<NFTCollection>;

  private identity: Secp256k1KeyIdentity;

  private lock: boolean;

  constructor({
    name,
    icon,
    walletNumber,
    mnemonic,
    registeredTokens = [],
    connectedApps = [],
    assets = DEFAULT_ASSETS,
    collections = [],
  }: PlugWalletArgs) {
    this.name = name || 'Account 1';
    this.icon = icon;
    this.walletNumber = walletNumber;
    this.assets = assets;
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
    this.connectedApps = [...connectedApps];
    this.collections = [...collections];
  }

  public setName(val: string): void {
    this.name = val;
  }

  public async sign(payload: ArrayBuffer): Promise<ArrayBuffer> {
    return this.identity.sign(payload);
  }

  public setIcon(val: string): void {
    this.icon = val;
  }

  // TODO: Make generic when standard is adopted. Just supports ICPunks rn.
  public getNFTs = async (): Promise<NFTCollection[] | null> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    let collections: NFTCollection[] = [];
    if (!this.lock) {
      this.lock = true;
      collections = await getAllUserNFTs(
        agent,
        Principal.fromText(this.principal)
      );
      this.lock = false;
      this.collections = collections;
      return collections;
    }
    return null;
  };

  public transferNFT = async (args: {
    token: NFTDetails;
    to: string;
  }): Promise<boolean> => {
    const { token, to } = args;
    if (!validatePrincipalId(to)) {
      throw new Error(ERRORS.INVALID_PRINCIPAL_ID);
    }
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const NFT = getNFTActor(token.canister, agent, token.standard);
    try {
      await NFT.transfer(
        Principal.fromText(to),
        parseInt(token.index.toString(), 10)
      );
      // Optimistically update the state
      const collections = this.collections.map(col => ({
        ...col,
        tokens: col.tokens.filter(tok => tok.id !== token.id),
      }));
      this.collections = collections.filter(col => col.tokens.length);
      return true;
    } catch (e) {
      throw new Error(ERRORS.TRANSFER_NFT_ERROR);
    }
  };

  public registerToken = async (
    canisterId: string
  ): Promise<StandardToken[]> => {
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const tokenActor = await createTokenActor(canisterId, agent);

    const metadata = await tokenActor.getMetadata();

    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const color = randomColor({ luminosity: 'light' });
    const tokenDescriptor = { ...metadata.fungible, canisterId, color };
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
    connectedApps: this.connectedApps,
    assets: this.assets.map(asset => ({
      ...asset,
      amount: parseInt(asset.amount.toString(), 10),
    })),
    nftCollections: this.collections.map(collection => ({
      ...collection,
      tokens: collection.tokens.map(token => ({
        ...token,
        index: parseInt(token.index.toString(), 10),
      })),
    })),
  });

  public burnXTC = async (to: string, amount: bigint) => {
    if (!validateCanisterId(to)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const xtcActor = await createTokenActor(TOKENS.XTC.canisterId, agent);
    const burnResult = await xtcActor.burnXTC({
      to: Principal.fromText(to),
      amount,
    });
    try {
      if ('Ok' in burnResult) {
        const trxId = burnResult.Ok;
        await requestCacheUpdate(this.principal, [trxId]);
      }
    } catch (e) {
      console.log('Kyasshu error');
    }
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
          amount: tokenBalance.toString(10),
          canisterId: token.canisterId,
        };
      })
    );
    const assets = [
      {
        name: 'ICP',
        symbol: 'ICP',
        amount: icpBalance.toString(10),
        canisterId: null,
      },
      ...tokenBalances,
    ];
    this.assets = assets;
    return assets;
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
    const icpTrxs = await getICPTransactions(this.accountId);
    const xtcTransactions = await getXTCTransactions(this.principal);
    // merge and format all trx. sort by timestamp
    // TODO: any custom token impelmenting archive should be queried. (0.4.0)
    return {
      total: icpTrxs.total + xtcTransactions.total,
      transactions: [
        ...icpTrxs.transactions,
        ...xtcTransactions.transactions,
      ].sort((a, b) => b.timestamp - a.timestamp),
    };
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

  public addConnectedApp = (app: ConnectedApp): Array<ConnectedApp> => {
    if (
      !app.url ||
      !app.name ||
      !app.icon ||
      !app.whitelist.every(item => validateCanisterId(item))
    ) {
      throw new Error(ERRORS.INVALID_APP);
    }
    this.connectedApps = uniqueByObjKey(
      [...this.connectedApps, app],
      'url'
    ) as ConnectedApp[];
    return this.connectedApps;
  };

  public deleteConnectedApp = (url: string): Array<ConnectedApp> => {
    if (!this.connectedApps.some(app => app.url === url)) {
      return this.connectedApps;
    }
    this.connectedApps = [...this.connectedApps.filter(app => app.url !== url)];
    return this.connectedApps;
  };

  public get publicKey(): PublicKey {
    return this.identity.getKeyPair().publicKey;
  }

  public get pemFile(): string {
    return getPem(this.identity);
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
    if (canisterId === TOKENS.XTC.canisterId) {
      try {
        if ('transactionId' in result) {
          const trxId = result.transactionId;
          await requestCacheUpdate(this.principal, [trxId]);
        }
      } catch (e) {
        console.log('Kyasshu error', e);
      }
    }

    return result;
  }
}

export default PlugWallet;
