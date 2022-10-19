import { NFTCollection } from '@psychedelic/dab-js';
import { Network, NetworkModuleParams } from '../PlugKeyRing/modules/NetworkModule';
import { TokenBalance } from './token';
import { IDENTITY_TYPES } from '../utils/account/constants';
import { GenericSignIdentity } from '../utils/identity/genericSignIdentity'


export interface ICNSData {
    names?: string[];
    reverseResolvedName?: string;
  }
  
export interface PlugWalletArgs {
    name?: string;
    walletId: string;
    orderNumber: number;
    walletNumber?: number;
    icon?: string;
    fetch: any;
    icnsData?: { names?: string[]; reverseResolvedName?: string };
    network: Network,
    identity: GenericSignIdentity,
    type: IDENTITY_TYPES,
}

export interface Assets {
    [canisterId: string]: TokenBalance
}

export interface JSONWallet {
    name: string;
    walletId: string;
    orderNumber: number;
    walletNumber?: number;
    principal: string;
    accountId: string;
    icon?: string;
    icnsData: ICNSData;
    networkModule?: NetworkModuleParams;
    type: IDENTITY_TYPES;
    keyPair: string;
}

export interface NFTDetailsBase<idT = bigint> {
    index: idT;
    canister: string;
    url: string;
    standard: string;
}
  
export interface WalletNFTCollection extends Omit<NFTCollection, 'tokens'> {
    tokens: NFTDetailsBase<bigint | string>[];
}
