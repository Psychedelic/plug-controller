export interface InferredTransaction {
  hash: string;
  timestamp: bigint;
  type: string;
  details?: { [key: string]: any };
  caller: string;
}

export interface GetTransactionsResponse {
  total: number;
  transactions: InferredTransaction[];
}
