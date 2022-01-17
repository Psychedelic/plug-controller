import { ConnectedApp } from './account';
import { StandardToken } from './token';


export interface TokenBalance {
    name: string;
    symbol: string;
    amount: string;
    canisterId: string | null;
    token?: StandardToken;
    error?: string;
}

export interface JSONWallet {
    name: string;
    walletNumber: number;
    principal: string;
    accountId: string;
    icon?: string;
    registeredTokens: { [canisterId: string]: StandardToken };
    connectedApps: Array<ConnectedApp>;
    assets?: Array<{
        name: string;
        symbol: string;
        amount: string;
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
