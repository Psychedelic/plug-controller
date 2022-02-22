import { ConnectedApp } from './account';
import { TokenBalance } from './token';


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
}
