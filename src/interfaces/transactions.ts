export interface InferredTransaction {
    hash: string;
    timestamp: bigint;
    type: string;
    details?: { [key: string]: any };
    caller: string;
}

export interface FormattedTransaction {
    hash: string;
    date: bigint;
    type: string;
    to: string;
    from: string;
    status: number;
    logo: string;
    symbol: string;
    canisterId: string;
    canisterInfo: Object;
    details?: { [key: string]: any };
}

export interface GetTransactionsResponse {
    total: number;
    transactions: InferredTransaction[];
}

export interface FormattedTransactions {
    total: number;
    transactions: FormattedTransaction[];
}