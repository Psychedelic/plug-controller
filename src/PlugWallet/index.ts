import { HttpAgent, PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import {
  getCachedUserNFTs,
  getNFTActor,
  NFTCollection,
  NFTDetails,
  getTokenActor,
  TokenInterfaces,
  getAddresses,
  addAddress,
  removeAddress,
  getAllUserNFTs,
  FungibleMetadata,
} from '@psychedelic/dab-js';
import randomColor from 'random-color';


import { ERRORS } from '../errors';
import { validateCanisterId, validatePrincipalId } from '../PlugKeyRing/utils';
import { createAgent } from '../utils/dfx';
import { getICPTransactions } from '../utils/dfx/history/rosetta';
import { TOKENS, DEFAULT_MAINNET_ASSETS } from '../constants/tokens';
import {
  getXTCTransactions,
  requestCacheUpdate,
} from '../utils/dfx/history/xtcHistory';
import { getCapTransactions } from '../utils/dfx/history/cap';

import { ConnectedApp } from '../interfaces/account';
import {
  JSONWallet,
  ICNSData,
  PlugWalletArgs,
  WalletNFTCollection,
} from '../interfaces/plug_wallet';
import { StandardToken, TokenBalance } from '../interfaces/token';
import { GetTransactionsResponse } from '../interfaces/transactions';
import ICNSAdapter from '../utils/dfx/icns';
import { recursiveParseBigint } from '../utils/object';
import {
  recursiveFindPrincipals,
  replacePrincipalsForICNS,
} from '../utils/dfx/icns/utils';
import { Address } from '../interfaces/contact_registry';
import { Network } from '../PlugKeyRing/modules/NetworkModule';
import { RegisteredNFT, RegisteredToken, uniqueTokens } from '../PlugKeyRing/modules/NetworkModule/Network';
import { getAccountId } from '../utils/account';
import { Types } from '../utils/account/constants';
import { GenericSignIdentity } from '../utils/identity/genericSignIdentity'
import { getTokensFromCollections } from '../utils/getTokensFromCollection';

class PlugWallet {
  name: string;
  icon?: string;
  walletId: string;
  orderNumber: number;
  walletNumber?: number;
  principal: string;
  fetch: any;
  icnsData: ICNSData;
  contacts: Array<Address>;
  type: Types;
  private identity: GenericSignIdentity;
  private agent: HttpAgent;
  private network: Network;


  constructor({
    name,
    icon,
    walletId,
    orderNumber,
    walletNumber,
    fetch,
    icnsData = {},
    network,
    identity,
    type,
  }: PlugWalletArgs) {
    this.name = name || 'Account 1';
    this.icon = icon;
    this.walletId = walletId;
    this.orderNumber = orderNumber;
    this.walletNumber = walletNumber;
    this.icnsData = icnsData;
    this.identity = identity;
    this.principal = identity.getPrincipal().toText();
    this.fetch = fetch;
    this.network = network;
    this.type = type;
    this.agent = createAgent({
      defaultIdentity: this.identity,
      fetch: this.fetch,
    });

  }

  get accountId(): string {
    return getAccountId(this.identity.getPrincipal());
  }

  public async setNetwork(network: Network) {
    this.network = network;
    this.agent = network.createAgent({ defaultIdentity: this.identity });
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

  private populateAndTrimNFTs = async (collections: NFTCollection[]): Promise<WalletNFTCollection[]> => {
    const icnsAdapter = new ICNSAdapter(this.agent);
    const collectionWithTokens = await getTokensFromCollections(this.network.registeredNFTS, this.principal, this.agent);
    const icnsCollection = await icnsAdapter.getICNSCollection();
    const unique = uniqueTokens([...collections, icnsCollection, ...collectionWithTokens]) as WalletNFTCollection[]
    const simplifiedCollections = unique.map((collection: NFTCollection): WalletNFTCollection => ({
      ...collection,
      tokens: collection.tokens.map((token) => ({
          index: token.index,
          url: token.url,
          canister: token.canister,
          standard: token.standard,
      })),
    }));
    const completeCollections = simplifiedCollections.filter((collection) => collection.tokens.length > 0);
    return completeCollections;
  }

  private nativeGetNFTs = async () => {
    try {
      const collections = await getAllUserNFTs({
        user: this.principal,
        agent: this.agent,
      });
      const populatedCollections = await this.populateAndTrimNFTs(collections)
      return populatedCollections;
    } catch (e) {
      console.warn('Error when trying to fetch NFTs natively from the IC', e);
      return null;
    }
  };


  // TODO: Make generic when standard is adopted. Just supports ICPunks rn.
  public getNFTs = async (args?: {
    refresh?: boolean;
  }): Promise<WalletNFTCollection[] | null> => {
    if (this.network.isCustom) return [];
    try {
      const collections = await getCachedUserNFTs({
        userPID: this.principal,
        refresh: args?.refresh,
      });
      const populatedCollections = await this.populateAndTrimNFTs(collections);
      return populatedCollections;
    } catch (e) {
      console.warn(
        'Error when trying to fetch NFTs from Kyasshu. Fetching natively...',
        e
      );
      // If kya fails, try native integration
      return await this.nativeGetNFTs();
    }
  };

  public transferNFT = async (args: {
    token: NFTDetails;
    to: string;
  }): Promise<boolean> => {
    const { token, to } = args;
    if (!validatePrincipalId(to)) {
      throw new Error(ERRORS.INVALID_PRINCIPAL_ID);
    }
    try {
      const NFT = getNFTActor({
        canisterId: token.canister,
        agent: this.agent,
        standard: token.standard,
      });

      await NFT.transfer(
        Principal.fromText(to),
        parseInt(token.index.toString(), 10)
      );
      getCachedUserNFTs({ userPID: this.principal, refresh: true }).catch(
        console.warn
      );
      return true;
    } catch (e) {
      console.warn('NFT transfer error: ', e);
      throw new Error(ERRORS.TRANSFER_NFT_ERROR);
    }
  };

  public getTokenInfo = async ({ canisterId, standard }) => {
    const token = await this.network.getTokenInfo({ canisterId, standard, defaultIdentity: this.identity });
    const balance = await this.getTokenBalance({ token });
    return balance;
  }

  public getNFTInfo = async ({ canisterId, standard }) => {
    const nft = await this.network.getNftInfo({ canisterId, identity: this.identity, standard });
    return nft;
  }

  public registerNFT = async ({canisterId, standard}): Promise<RegisteredNFT[]> => {
    const nfts = await this.network.registerNFT({canisterId, standard, walletId: this.walletNumber, identity: this.identity});
    return nfts;
  }

  public registerToken = async (args: {
    canisterId: string;
    standard: string;
    logo?: string;
  }): Promise<TokenBalance> => {
    const { canisterId, standard = 'ext', logo } = args || {};

    // Register token in network
    const tokens = await this.network.registerToken({
      canisterId,
      standard,
      walletId: this.walletId,
      defaultIdentity: this.identity,
      logo,
    });

    // Get token balance
    const tokenActor = await getTokenActor({
      canisterId,
      agent: this.agent,
      standard,
    });
    const balance = await tokenActor.getBalance(
      Principal.fromText(this.principal)
    );

    // Format token and add asset to wallet state
    const color = randomColor({ luminosity: 'light' });
    const registeredToken = tokens.find(t => t.canisterId === canisterId) as RegisteredToken;
    const tokenDescriptor = {
      amount: balance.value,
      token: {
        ...registeredToken,
        decimals: parseInt(registeredToken.decimals.toString(), 10),
        canisterId,
        color,
        standard,
        logo,
      },
    };
    return tokenDescriptor;
  };

  public toJSON = (): JSONWallet => ({
    name: this.name,
    walletId: this.walletId,
    orderNumber: this.orderNumber,
    walletNumber: this.walletNumber,
    principal: this.identity.getPrincipal().toText(),
    accountId: this.accountId,
    icon: this.icon,
    icnsData: this.icnsData,
    type: this.type,
    keyPair: this.identity.toJSON()
  });

  public burnXTC = async (args: { to: string; amount: string }) => {
    if (!validateCanisterId(args.to)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const xtcActor = await getTokenActor({
      canisterId: TOKENS.XTC.canisterId,
      agent: this.agent,
      standard: TOKENS.XTC.standard,
    });
    const burnResult = await xtcActor.burnXTC({
      to: Principal.fromText(args.to),
      amount: args.amount,
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

  public getTokenBalance = async ({
    token,
  }: {
    token: StandardToken;
  }): Promise<TokenBalance> => {
    try {
      const tokenActor = await getTokenActor({
        canisterId: token.canisterId,
        agent: this.agent,
        standard: token.standard,
      });

      const balance = await tokenActor.getBalance(this.identity.getPrincipal());
      const tokenMetadata = await tokenActor.getMetadata() as FungibleMetadata;
      return {
        amount: balance.value,
        token: {
          ...token,
          fee: tokenMetadata?.fungible?.fee,
        },
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
    const walletTokens = this.network.getTokens(this.walletId);
    const tokenBalances = await Promise.all(walletTokens.map(token => this.getTokenBalance({ token })));
    const assets = tokenBalances.reduce((acc, token) => ({ ...acc, [token.token.canisterId]: token }), {});
    return tokenBalances;
  };


  public getTransactions = async (): Promise<GetTransactionsResponse> => {
    if (this.network.isCustom) return { total: 0, transactions: [] };
    const icnsAdapter = new ICNSAdapter(this.agent);
    const icpTrxs = await getICPTransactions(this.accountId);
    const xtcTransactions = await getXTCTransactions(this.principal);
    const capTransactions = await getCapTransactions({
      principalId: this.principal,
      agent: this.agent,
    });
    let transactionsGroup = [
      ...capTransactions.transactions,
      ...icpTrxs.transactions,
      ...xtcTransactions.transactions,
    ];
    const principals = recursiveFindPrincipals(transactionsGroup);
    const icnsMapping = await icnsAdapter.getICNSMappings(principals);
    transactionsGroup = transactionsGroup.map(tx =>
      replacePrincipalsForICNS(tx, icnsMapping)
    );
    transactionsGroup = transactionsGroup.map(tx => ({
      ...tx,
      details: {
        ...tx.details,
        token:
          tx.details?.canisterId && this.network.tokens.find((token) => token.canisterId === tx.details?.canisterId),
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

  public send = async (args: {
    to: string;
    amount: string;
    canisterId: string;
    opts?: TokenInterfaces.SendOpts;
  }): Promise<TokenInterfaces.SendResponse> => {
    const { to, amount, canisterId, opts } = args || {};
    const savedToken = this.network.tokenByCanisterId(canisterId);
    if (!savedToken) throw new Error(ERRORS.TOKEN_NOT_REGISTERED);
    const tokenActor = await getTokenActor({
      canisterId,
      agent: this.agent,
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

  public getAgent({ host }: { host?: string }): HttpAgent {
    if (host) {
      return createAgent({
        defaultIdentity: this.identity,
        host,
        wrapped: false,
        fetch: this.fetch,
      })
    }
    return this.agent;
  }

  public get publicKey(): PublicKey {
    return this.identity.getPublicKey();
  }

  public get pemFile(): string {
    return this.identity.getPem();
  }

  public getICNSData = async (): Promise<{
    names: string[];
    reverseResolvedName: string | undefined;
  }> => {
    if (this.network.isCustom) return { names: [], reverseResolvedName: undefined };
    const icnsAdapter = new ICNSAdapter(this.agent);
    const names = await icnsAdapter.getICNSNames();
    const reverseResolvedName = await icnsAdapter.getICNSReverseResolvedName();
    this.icnsData = { names, reverseResolvedName };
    return { names, reverseResolvedName };
  };

  public getReverseResolvedName = async (): Promise<string | undefined> => {
    const icnsAdapter = new ICNSAdapter(this.agent);
    return icnsAdapter.getICNSReverseResolvedName();
  };

  public setReverseResolvedName = async ({
    name,
  }: {
    name: string;
  }): Promise<string> => {
    const icnsAdapter = new ICNSAdapter(this.agent);
    return icnsAdapter.setICNSReverseResolvedName(name);
  };

  public getContacts = async (): Promise<Array<Address>> => {
    if (this.network.isCustom) return [];
    try {
      return await getAddresses(this.agent);
    } catch (e) {
      return [];
    }
  };

  public addContact = async ({
    contact,
  }: {
    contact: Address;
  }): Promise<boolean> => {
    try {
      const contactResponse = await addAddress(this.agent, contact);

      return contactResponse.hasOwnProperty('Ok') ? true : false;
    } catch (e) {
      return false;
    }
  };

  public deleteContact = async ({
    addressName,
  }: {
    addressName: string;
  }): Promise<boolean> => {
    try {
      const contactResponse = await removeAddress(this.agent, addressName);

      return contactResponse.hasOwnProperty('Ok') ? true : false;
    } catch (e) {
      return false;
    }
  };

  public removeToken = async (args: {
    canisterId: string;
  }): Promise<StandardToken[]> => {
    const { canisterId } = args || {};
    const isDefaultAsset = Object.keys(DEFAULT_MAINNET_ASSETS).includes(canisterId);
    
    // If it's a default asset, early return
    if (isDefaultAsset) return this.network.tokens;
    
    const tokens = await this.network.removeToken({
      canisterId,
    });
    return tokens;
  };
}

export default PlugWallet;
