export interface StandardToken {
    name: string;
    symbol: string;
    canisterId: string;
    standard: string;
    decimals: number;
    color?: string;
    logo?: string;
}

export interface TokenBalance {
    amount: string;
    token: StandardToken;
    error?: string;
}
