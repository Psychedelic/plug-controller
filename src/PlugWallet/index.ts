import { PublicKey } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import randomColor from 'random-color';

import { ERRORS } from '../errors';
import { StandardToken, TokenBalance } from '../interfaces/ext';
import { validateCanisterId } from '../PlugKeyRing/utils';
import { createAccountFromMnemonic } from '../utils/account';
import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';
import { createAgent, createLedgerActor } from '../utils/dfx';
import { createTokenActor, SendResponse } from '../utils/dfx/token';
import { SendOpts } from '../utils/dfx/ledger/methods';
import { getTransactions, GetTransactionsResponse } from '../utils/dfx/rosetta';
import { TOKENS, NFTs } from '../constants/tokens';
import { uniqueByObjKey } from '../utils/array';

import { StandardNFT, TokenDesc } from '../interfaces/nft';
import { createNFTActor } from '../utils/dfx/nft';

interface PlugWalletArgs {
  name?: string;
  walletNumber: number;
  mnemonic: string;
  icon?: string;
  registeredTokens?: Array<StandardToken>;
  registeredNFTs?: Array<StandardNFT>;
}

interface JSONWallet {
  name: string;
  walletNumber: number;
  principal: string;
  accountId: string;
  icon?: string;
  registeredTokens?: Array<StandardToken>;
  registeredNFTs?: Array<StandardNFT>;
}

class PlugWallet {
  name: string;

  icon?: string;

  walletNumber: number;

  accountId: string;

  principal: string;

  registeredTokens: Array<StandardToken>;

  registeredNFTs: Array<StandardNFT>;

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
    this.registeredNFTs = [NFTs.IC_PUNKS];
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

  // TODO: Make generic when standard is adopted. Just supports ICPunks rn.
  public getNFTs = async (): Promise<Array<TokenDesc>> => {
    const { secretKey } = this.identity.getKeyPair();
    const agent = await createAgent({ secretKey });
    const NFT = createNFTActor(agent, NFTs.IC_PUNKS.canisterId);
    const nfts = await NFT.user_tokens(Principal.from(this.principal));

    // Need to cast cause candid is bugged
    const nftData: Array<TokenDesc> = await Promise.all(
      nfts.map(async punkId => {
        const [nft] = await NFT.data_of(punkId);
        if (!nft) {
          throw new Error('Error while fetching NFT data');
        }
        return nft;
      })
    );
    return nftData as Array<TokenDesc>;
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
