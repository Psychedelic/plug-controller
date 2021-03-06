import { NFTCollection } from '@psychedelic/dab-js';
import { ConnectedApp } from './account';
import { TokenBalance } from './token';

export interface ICNSData {
    names?: string[];
    reverseResolvedName?: string;
  }
  
export interface PlugWalletArgs {
    name?: string;
    walletNumber: number;
    mnemonic: string;
    icon?: string;
    connectedApps?: Array<ConnectedApp>;
    assets?: Assets;
    collections?: Array<NFTCollection>;
    fetch: any;
    icnsData?: { names?: string[]; reverseResolvedName?: string };
}

export interface Assets {
    [canisterId: string]: TokenBalance
}

export interface JSONWallet {
    name: string;
    walletNumber: number;
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
}
