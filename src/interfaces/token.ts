export interface TokenMetaData {
    name: string;
    decimals: number;
    symbol: string;
}
export interface StandardToken extends TokenMetaData {
    canisterId: string;
    standard: string;
    color?: string;
}
