export interface InferredTransaction {
    hash: string;
    timestamp: bigint;
    type: string;
    details?: { [key: string]: any };
    caller: string;
}

export type Nullable<T> = T | null;

export interface FormattedTransaction {
    type: string;
    to: string;
    from: string;
    hash: string;
    amount: Nullable<number | typeof NaN>; // borrar esto
    value?: Nullable<number>; // borrar esto
    decimal?: number;
    status: number;
    date: bigint;
    symbol: string;
    logo: string;
    canisterId: string;
    details?: { [key: string]: any };
    canisterInfo?: Object;
  }

export interface GetTransactionsResponse {
    total: number;
    transactions: InferredTransaction[];
}

export interface FormattedTransactions {
    total: number;
    transactions: FormattedTransaction[];
}
