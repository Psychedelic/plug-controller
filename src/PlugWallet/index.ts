import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import {
  getCachedUserNFTs,
  getNFTActor,
  NFTCollection,
  NFTDetails,
  getTokenActor,
  TokenInterfaces,
} from '@psychedelic/dab-js';
import randomColor from 'random-color';

import { ERRORS } from '../errors';
import { validateCanisterId, validatePrincipalId } from '../PlugKeyRing/utils';
import { createAccountFromMnemonic } from '../utils/account';
import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';
import { createAgent } from '../utils/dfx';
import { getICPTransactions } from '../utils/dfx/history/rosetta';
import { TOKENS, DEFAULT_ASSETS } from '../constants/tokens';
import { uniqueByObjKey } from '../utils/array';
import {
  getXTCTransactions,
  requestCacheUpdate,
} from '../utils/dfx/history/xtcHistory';
import { getCapTransactions } from '../utils/dfx/history/cap';

import { ConnectedApp } from '../interfaces/account';
import { JSONWallet, Assets, ICNSData, PlugWalletArgs } from '../interfaces/plug_wallet';
import { StandardToken, TokenBalance } from '../interfaces/token';
import { GetTransactionsResponse } from '../interfaces/transactions';
import ICNSAdapter from '../utils/dfx/icns';
import { recursiveParseBigint } from '../utils/object';
import { recursiveFindPrincipals, replacePrincipalsForICNS } from '../utils/dfx/icns/utils';

class PlugWallet {
  name: string;

  icon?: string;

  walletNumber: number;

  accountId: string;

  principal: string;

  fetch: any;

  connectedApps: Array<ConnectedApp>;

  assets: Assets;

  icnsData: ICNSData;

  collections: Array<NFTCollection>;

  private identity: Secp256k1KeyIdentity;

  constructor({
    name,
    icon,
    walletNumber,
    mnemonic,
    connectedApps = [],
    assets = DEFAULT_ASSETS,
    collections = [],
    fetch,
    icnsData = {}
  }: PlugWalletArgs) {
    this.name = name || 'Account 1';
    this.icon = icon;
    this.walletNumber = walletNumber;
    this.assets = assets;
    this.icnsData = icnsData;
    const { identity, accountId } = createAccountFromMnemonic(
      mnemonic,
      walletNumber
    );
    this.identity = identity;
    this.accountId = accountId;
    this.principal = identity.getPrincipal().toText();
    this.connectedApps = [...connectedApps];
    this.collections = [...collections];
    this.fetch = fetch;
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

  // TODO: Make generic when standard is adopted. Just supports ICPunks rn.
  public getNFTs = async (
    refresh?: boolean
  ): Promise<NFTCollection[] | null> => {
    try {
      const { secretKey } = this.identity.getKeyPair();
      const agent = createAgent({ secretKey, fetch: this.fetch });
      const icnsAdapter = new ICNSAdapter(agent)
      this.collections = await getCachedUserNFTs({
        userPID: this.principal,
        refresh,
      });
      const icnsCollection = await icnsAdapter.getICNSCollection();
      return [...this.collections, icnsCollection];
    } catch (e) {
      return null;
    }
  };

  public transferNFT = async (args: {
    token: NFTDetails;
    to: string;
  }): Promise<NFTCollection[]> => {
    const { token, to } = args;
    if (!validatePrincipalId(to)) {
      throw new Error(ERRORS.INVALID_PRINCIPAL_ID);
    }
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    try {
      const NFT = getNFTActor({
        canisterId: token.canister,
        agent,
        standard: token.standard,
      });

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
      getCachedUserNFTs({ userPID: this.principal, refresh: true }).catch(
        console.warn
      );
      return this.collections;
    } catch (e) {
      throw new Error(ERRORS.TRANSFER_NFT_ERROR);
    }
  };

  public registerToken = async (
    canisterId: string,
    standard = 'ext'
  ): Promise<TokenBalance[]> => {
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const tokenActor = await getTokenActor({ canisterId, agent, standard });

    const metadata = await tokenActor.getMetadata();

    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }

    const balance = await tokenActor.getBalance(
      Principal.fromText(this.principal)
    );

    const color = randomColor({ luminosity: 'light' });
    const tokenDescriptor = {
      amount: balance.value,
      token: {
        ...metadata.fungible,
        canisterId,
        color,
        standard,
      },
    };
    const newTokens = {
      ...this.assets,
      [canisterId]: tokenDescriptor,
    };
    // const unique = uniqueByObjKey(newTokens, 'symbol') as StandardToken[];
    this.assets = newTokens;
    return Object.values(newTokens);
  };

  public removeToken = async (tokenId: string): Promise<TokenBalance[]> => {
    if (!Object.keys(this.assets).includes(tokenId)) {
      return Object.values(this.assets);
    }
    const { [tokenId]: removedToken, ...newTokens } = this.assets;
    this.assets = newTokens;
    return Object.values(newTokens);
  };

  public toJSON = (): JSONWallet => ({
    name: this.name,
    walletNumber: this.walletNumber,
    principal: this.identity.getPrincipal().toText(),
    accountId: this.accountId,
    icon: this.icon,
    connectedApps: this.connectedApps,
    assets: this.assets,
    nftCollections: recursiveParseBigint(this.collections),
    icnsData: this.icnsData,
  });

  public burnXTC = async (to: string, amount: string) => {
    if (!validateCanisterId(to)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const xtcActor = await getTokenActor({
      canisterId: TOKENS.XTC.canisterId,
      agent,
      standard: TOKENS.XTC.standard,
    });
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
      console.log('Kyasshu error', e);
    }
    return burnResult;
  };

  public getTokenBalance = async (
    token: StandardToken
  ): Promise<TokenBalance> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const tokenActor = await getTokenActor({
      canisterId: token.canisterId,
      agent,
      standard: token.standard,
    });
    try {
      const balance = await tokenActor.getBalance(this.identity.getPrincipal());
      return {
        amount: balance.value,
        token,
      };
    } catch (e) {
      console.warn('Get Balance error:', e);
      return {
        amount: 'Error',
        token,
        error: e.message,
      };
    }
  };

  /*
   ** Returns XTC, ICP and WICP balances and all associated registered token balances
   ** If any token balance fails to be fetched, it will be flagged with an error
   */
  public getBalances = async (): Promise<Array<TokenBalance>> => {
    // Get Custom Token Balances
    const tokenBalances = await Promise.all(
      Object.values(this.assets).map(asset => this.getTokenBalance(asset.token))
    );

    Object.values(tokenBalances).forEach(asset => {
      const { canisterId } = asset.token;
      const { amount } = asset;
      this.assets[canisterId] = {
        ...this.assets[canisterId],
        amount,
      };
    });

    return tokenBalances;
  };

  public getTokenInfo = async (
    canisterId: string,
    standard = 'ext'
  ): Promise<{ token: StandardToken; amount: string }> => {
    const { secretKey } = this.identity.getKeyPair();
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const savedStandard = this.assets[canisterId]?.token.standard || standard;
    const tokenActor = await getTokenActor({
      canisterId,
      agent,
      standard: savedStandard,
    });

    const metadataResult = await tokenActor.getMetadata();

    const metadata = metadataResult;
    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const tokenBalance = await tokenActor.getBalance(
      this.identity.getPrincipal()
    );
    const token = {
      ...metadata.fungible,
      canisterId,
      standard: savedStandard,
    };

    return { token, amount: tokenBalance.value };
  };


  public getTransactions = async (): Promise<GetTransactionsResponse> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const icnsAdapter = new ICNSAdapter(agent);
    const icpTrxs = await getICPTransactions(this.accountId);
    const xtcTransactions = await getXTCTransactions(this.principal);
    const capTransactions = await getCapTransactions(this.principal);
    let transactionsGroup = [
      ...capTransactions.transactions,
      ...icpTrxs.transactions,
      ...xtcTransactions.transactions,
    ];
    const principals = recursiveFindPrincipals(transactionsGroup);
    const icnsMapping = await icnsAdapter.getICNSMappings(principals);
    transactionsGroup = transactionsGroup.map(tx => replacePrincipalsForICNS(tx, icnsMapping));
    transactionsGroup = transactionsGroup.map(tx => ({
      ...tx,
      details: {
        ...tx.details,
        token:
          tx.details?.canisterId && this.assets[tx.details?.canisterId]?.token,
      },
    }));

    // merge and format all trx. sort by timestamp
    // TODO: any custom token impelmenting archive should be queried. (0.4.0)
    const transactions = {
      total: icpTrxs.total + xtcTransactions.total + capTransactions.total,
      transactions: transactionsGroup.sort((a, b) =>
        b.timestamp - a.timestamp < 0 ? -1 : 1
      ),
    };
    return transactions;
  };

  public send = async (
    to: string,
    amount: string,
    canisterId: string,
    opts?: TokenInterfaces.SendOpts
  ): Promise<TokenInterfaces.SendResponse> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const savedToken = this.assets[canisterId].token;
    const tokenActor = await getTokenActor({
      canisterId,
      agent,
      standard: savedToken.standard,
    });

    const result = await tokenActor.send({
      to,
      from: this.identity.getPrincipal().toString(),
      amount: BigInt(amount),
      opts,
    });
    if (canisterId === TOKENS.XTC.canisterId) {
      try {
        if ('transactionId' in result) {
          const trxId = result.transactionId;
          await requestCacheUpdate(this.principal, [BigInt(trxId)]);
        }
      } catch (e) {
        console.log('Kyasshu error', e);
      }
    }

    return result;
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
    return this.identity.getPem();
  }

  public getICNSData = async (): Promise<{ names: string[], reverseResolvedName: string | undefined}> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const icnsAdapter = new ICNSAdapter(agent);
    const names = await icnsAdapter.getICNSNames();
    const reverseResolvedName = await icnsAdapter.getICNSReverseResolvedName();
    this.icnsData = { names, reverseResolvedName };
    return { names, reverseResolvedName };
  }

  public getReverseResolvedName = async (): Promise<string | undefined> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const icnsAdapter = new ICNSAdapter(agent);
    return icnsAdapter.getICNSReverseResolvedName();
  }

  public setReverseResolvedName = async (name: string): Promise<string> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = createAgent({ secretKey, fetch: this.fetch });
    const icnsAdapter = new ICNSAdapter(agent);
    return icnsAdapter.setICNSReverseResolvedName(name);
  }
}

export default PlugWallet;
