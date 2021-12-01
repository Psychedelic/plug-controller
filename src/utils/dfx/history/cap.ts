/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse } from 'axios';
import { Principal } from '@dfinity/principal';
import {
  prettifyCapTransactions,
  TransactionPrettified,
} from '@psychedelic/cap-js';
import crossFetch from 'cross-fetch';

import { getCanisterInfo } from '../../dab';
import { InferredTransaction } from './rosetta';

const KYASHU_URL = 'https://kyasshu.fleek.co';

interface KyashuItem {
  contractId: string;
  event: any;
  pk: string;
  sk: string;
  userId: string;
  gs1sk: string;
  gs1pk: string;
  caller: Principal;
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

const parsePrincipal = pidObj =>
  pidObj?._isPrincipal
    ? Principal.fromUint8Array(
        new Uint8Array(Object.values((pidObj as any)._arr))
      ).toString()
    : pidObj;

const getTransactionCanister = (contract: string): string | undefined =>
  contract?.split('#')?.[1];

const formatTransaction = (
  transaction: TransactionPrettified,
  sk: string,
  contractId: string
): InferredTransaction => ({
  hash: sk,
  timestamp: transaction.time,
  type: transaction.operation,
  details: {
    ...transaction.details,
    canisterId: getTransactionCanister(contractId),
    tokenId: transaction.details?.token_id || transaction.details?.token || '',
    to: parsePrincipal(transaction?.details?.to),
    from: parsePrincipal(transaction?.details?.from),
  },
  caller: parsePrincipal(transaction.caller) || '',
});

export const getCapTransactions = async ({
  principalId,
  lastEvaluatedKey,
  fetch,
} :{
  principalId: string,
  lastEvaluatedKey?: string,
  fetch?: typeof crossFetch,
}): Promise<GetUserTransactionResponse> => {
  const url = `${KYASHU_URL}/cap/user/txns/${principalId}${
    lastEvaluatedKey ? `?LastEvaluatedKey=${lastEvaluatedKey}` : ''
  }`;
  try {
    const response = await axios.get<any, AxiosResponse<KyashuResponse>>(url);
    const canisterIds = [
      ...new Set(
        response.data.Items.map(item => getTransactionCanister(item.contractId))
      ),
    ].filter(value => value) as string[];
    const dabInfo = await Promise.all(
      canisterIds.map(async canisterId => {
        let canisterInfo = { canisterId };
        try {
          const fetchedCanisterInfo = await getCanisterInfo({ canisterId, fetch });
          canisterInfo = { canisterId, ...fetchedCanisterInfo };
        } catch (error) {
          /* eslint-disable-next-line */
        console.error("DAB error: ", error);
        }
        return canisterInfo;
      })
    );
    const canistersInfo = dabInfo.reduce(
      (acum, info) => ({ ...acum, [info.canisterId]: info }),
      {}
    );
    const transactions = response.data.Items.map(item => {
      const canisterId = getTransactionCanister(item.contractId);
      const formattedTx = formatTransaction(
        prettifyCapTransactions(item.event),
        item.sk,
        item.contractId
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
