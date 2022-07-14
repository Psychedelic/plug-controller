import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import crossFetch from 'cross-fetch';
import { InferredTransaction } from './transactions';

export interface LastEvaluatedKey {
  pk: string;
  sk: string;
  userId: string;
}

export interface GetUserTransactionResponse {
  total: number;
  transactions: InferredTransaction[];
  lastEvaluatedKey?: LastEvaluatedKey;
}

export interface GetCapTransactionsParams {
  principalId: string;
  lastEvaluatedKey?: LastEvaluatedKey;
  agent?: HttpAgent;
}

export interface KyashuItem {
  contractId: string;
  event: any;
  pk: string;
  sk: string;
  userId: string;
  gs1sk: string;
  gs1pk: string;
  caller: Principal;
}
