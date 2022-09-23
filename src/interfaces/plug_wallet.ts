import { NFTCollection } from '@psychedelic/dab-js';
import { Network, NetworkModuleParams } from '../PlugKeyRing/modules/NetworkModule';
import { ConnectedApp } from './account';
import { TokenBalance } from './token';
import { Types } from '../utils/account/constants';
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
    connectedApps?: Array<ConnectedApp>;
    assets?: Assets;
    collections?: Array<NFTCollection>;
    fetch: any;
    icnsData?: { names?: string[]; reverseResolvedName?: string };
    network: Network,
    identity: GenericSignIdentity,
    type: Types,
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
    connectedApps: Array<ConnectedApp>;
    assets: Assets;
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
    icnsData: ICNSData;
    networkModule?: NetworkModuleParams;
    type: Types;
    keyPair: string;
}
