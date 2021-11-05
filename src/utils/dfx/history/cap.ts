/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse } from 'axios';
import { Principal } from '@dfinity/principal';
import {
  prettifyCapTransactions,
  TransactionPrettified,
} from '@psychedelic/cap-js';
import { getMultipleCanisterInfo } from '../../dab';
import { InferredTransaction } from './rosetta';

const KYASHU_URL = 'https://kyasshu.fleek.co';

interface KyashuItem {
  event: any;
  pk: string;
  sk: string;
  userId: string;
  gs1sk: string;
  gs1pk: string;
}

interface LastEvaluatedKey {
  pk: string;
  sk: string;
  userId: string;
}

interface KyashuResponse {
  Count: number;
  Items: KyashuItem[];
  LastEvaluatedKey: LastEvaluatedKey;
}

export interface GetUserTransactionResponse {
  total: number;
  transactions: InferredTransaction[];
  lastEvaluatedKey?: LastEvaluatedKey;
}

const getTransactionCanister = (sk: string): string | undefined =>
  sk?.split('#')?.[1];

const formatTransaction = (
  transaction: TransactionPrettified,
  sk: string
): InferredTransaction => ({
  hash: sk,
  timestamp: transaction.time,
  type: transaction.operation,
  details: { ...transaction.details, canisterId: getTransactionCanister(sk) },
  caller: Principal.fromUint8Array((transaction.caller as any)._arr).toString(),
});

export const getCapTransactions = async (
  principalId: string,
  lastEvaluatedKey?: string
): Promise<GetUserTransactionResponse> => {
  const url = `${KYASHU_URL}/cap/user/txns/${principalId}${
    lastEvaluatedKey ? `?LastEvaluatedKey=${lastEvaluatedKey}` : ''
  }`;
  try {
    const response = await axios.get<any, AxiosResponse<KyashuResponse>>(url);
    const canisterIds = [
      ...new Set(
        response.data.Items.map(item => getTransactionCanister(item.sk))
      ),
    ].filter(value => value) as string[];
    const canistersInfo = (await getMultipleCanisterInfo(canisterIds)).reduce(
      (acum, canisterInfo, idx) => ({
        ...acum,
        [canisterIds[idx]]: { canisterId: canisterIds[idx], ...canisterInfo },
      }),
      {}
    );
    const transactions = response.data.Items.map(item => {
      const canisterId = getTransactionCanister(item.sk);
      const formattedTx = formatTransaction(
        prettifyCapTransactions(item.event),
        item.sk
      );
      return {
        ...formattedTx,
        canisterInfo: canisterId ? canistersInfo[canisterId] : undefined,
      };
    });
    return {
      total: response.data.Count,
      lastEvaluatedKey: response.data.LastEvaluatedKey,
      transactions,
    };
  } catch (e) {
    return {
      total: 0,
      transactions: [],
    };
  }
};

export default {};
