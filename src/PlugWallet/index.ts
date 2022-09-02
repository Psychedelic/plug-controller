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
} from '@psychedelic/dab-js';
import randomColor from 'random-color';

import { ERRORS } from '../errors';
import { validateCanisterId, validatePrincipalId } from '../PlugKeyRing/utils';
import { createAccountFromMnemonic } from '../utils/account';
import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';
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
  Assets,
  ICNSData,
  PlugWalletArgs,
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
import { RegisteredToken } from '../PlugKeyRing/modules/NetworkModule/Network';

class PlugWallet {
  name: string;

  icon?: string;

  walletNumber: number;

  accountId: string;

  principal: string;

  fetch: any;

  connectedApps: Array<ConnectedApp>;

  icnsData: ICNSData;

  collections: Array<NFTCollection>;

  contacts: Array<Address>;

  assets: Assets;

  private identity: Secp256k1KeyIdentity;

  private agent: HttpAgent;

  private network: Network;

  constructor({
    name,
    icon,
    walletNumber,
    mnemonic,
    connectedApps = [],
    assets = DEFAULT_MAINNET_ASSETS,
    collections = [],
    fetch,
    icnsData = {},
    network,
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
    this.network = network;
    this.agent = createAgent({
      secretKey: this.identity.getKeyPair().secretKey,
      fetch: this.fetch,
    });

  }

  public async setNetwork(network: Network) {
    this.network = network;
    this.agent = network.createAgent({ secretKey: this.identity.getKeyPair().secretKey});
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

  private nativeGetNFTs = async () => {
    const icnsAdapter = new ICNSAdapter(this.agent);
    try {
      this.collections = await getAllUserNFTs({
        user: this.principal,
        agent: this.agent,
      });
      const icnsCollection = await icnsAdapter.getICNSCollection();
      return [...this.collections, icnsCollection];
    } catch (e) {
      console.warn('Error when trying to fetch NFTs natively from the IC', e);
      return null;
    }
  };

  // TODO: Make generic when standard is adopted. Just supports ICPunks rn.
  public getNFTs = async (args?: {
    refresh?: boolean;
  }): Promise<NFTCollection[] | null> => {
    if (this.network.isCustom) return [];
    try {
      const icnsAdapter = new ICNSAdapter(this.agent);
      this.collections = await getCachedUserNFTs({
        userPID: this.principal,
        refresh: args?.refresh,
      });
      const icnsCollection = await icnsAdapter.getICNSCollection();
      return [...this.collections, icnsCollection];
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
  }): Promise<NFTCollection[]> => {
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
      // Optimistically update the state
      const collections = this.collections.map(col => ({
        ...col,
        tokens: col.tokens.filter(tok => tok.index !== token.index),
      }));
      this.collections = collections.filter(col => col.tokens.length);
      getCachedUserNFTs({ userPID: this.principal, refresh: true }).catch(
        console.warn
      );
      return this.collections;
    } catch (e) {
      console.warn('NFT transfer error: ', e);
      throw new Error(ERRORS.TRANSFER_NFT_ERROR);
    }
  };

  public getTokenInfo = async ({ canisterId, standard }) => {
    const token = await this.network.getTokenInfo({ canisterId, standard, secretKey: this.identity.getKeyPair().secretKey });
    const balance = await this.getTokenBalance({ token });
    return balance;
  }

  public registerToken = async (args: {
    canisterId: string;
    standard: string;
    logo?: string;
  }): Promise<TokenBalance[]> => {
    const { canisterId, standard = 'ext', logo } = args || {};

    // Register token in network
    const tokens = await this.network.registerToken({
      canisterId,
      standard,
      walletId: this.walletNumber,
      secretKey: this.identity.getKeyPair().secretKey,
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
    this.assets = {
      ...this.assets,
      [canisterId]: tokenDescriptor,
    };
    return Object.values(this.assets);
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
    const walletTokens = this.network.getTokens(this.walletNumber);
    const tokenBalances = await Promise.all(walletTokens.map(token => this.getTokenBalance({ token })));
    const assets = tokenBalances.reduce((acc, token) => ({ ...acc, [token.token.canisterId]: token }), {});
    this.assets = assets;
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

  public send = async (args: {
    to: string;
    amount: string;
    canisterId: string;
    opts?: TokenInterfaces.SendOpts;
  }): Promise<TokenInterfaces.SendResponse> => {
    const { to, amount, canisterId, opts } = args || {};
    const savedToken = this.assets[canisterId].token;
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
        secretKey: this.identity.getKeyPair().secretKey,
        host,
        wrapped: false,
        fetch: this.fetch,
      })
    }
    return this.agent;
  }

  public get publicKey(): PublicKey {
    return this.identity.getKeyPair().publicKey;
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
}

export default PlugWallet;
