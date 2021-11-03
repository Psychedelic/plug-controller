/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse } from 'axios';
import { prettifyCapTransactions, TransactionPrettified } from '@psychedelic/cap-js';
import { CanisterInfo, getMultipleCanisterInfo } from '../../dab';

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

interface CapUserTransaction extends TransactionPrettified {
  canisterInfo: CanisterInfo & { canisterId: string };
}

export interface GetUserTransactionResponse {
  total: number;
  transactions: CapUserTransaction[];
  lastEvaluatedKey?: LastEvaluatedKey;
}

const getTransactionCanister = (sk: string): string | undefined => sk?.split('#')?.pop()?.[0];


export const getUserTransactions = async (
  principalId: string,
  lastEvaluatedKey?: string,
): Promise<GetUserTransactionResponse> => {
  const url = `${KYASHU_URL}/cap/user/txns/${principalId}${lastEvaluatedKey ? `?LastEvaluatedKey=${lastEvaluatedKey}` : ''}`;
  try {
    const response = await axios.get<any, AxiosResponse<KyashuResponse>>(url);
    const canisterIds = [...new Set(response.data.Items.map(item => getTransactionCanister(item.sk)))].filter(value => value) as string[]
    const canistersInfo = (await getMultipleCanisterInfo(canisterIds))
      .reduce((acum, canisterInfo, idx) => ({ ...acum, [canisterIds[idx]]: { canisterId: canisterIds[idx], ...canisterInfo } }), {})
    return {
      total: response.data.Count,
      lastEvaluatedKey: response.data.LastEvaluatedKey,
      transactions: response.data.Items.map(item => {
        const canisterId = getTransactionCanister(item.sk)
        return {
          canisterInfo: canisterId ? canistersInfo[canisterId] : undefined,
          ...prettifyCapTransactions(item.event)
        }
      }
      ),
    };
  } catch (e) {
    return {
      total: 0,
      transactions: [],
    };
  }
};

export default {};
