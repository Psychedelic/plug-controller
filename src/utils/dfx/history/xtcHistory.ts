/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';

import { GetTransactionsResponse } from '../../../interfaces/transactions';
import { formatXTCTransaction } from '../../formatter/transaction/xtcTransactionFormatter';

const KYASHU_URL = 'https://kyasshu.fleek.co';

export const getXTCTransactions = async (
  principalId: string,
  txnIds?: Array<bigint>
): Promise<GetTransactionsResponse> => {
  const url = `${KYASHU_URL}/txns/${principalId}${
    txnIds?.length ? `?txnIds=[${txnIds.join(',')}]` : ''
  }`;
  try {
    const response = await axios.get(url);
    return {
      total: response.data.length,
      transactions: response.data.map(transaction =>
        formatXTCTransaction(principalId, transaction)
      ),
    } as GetTransactionsResponse;
  } catch (e) {
    console.log('getXTCTransactions error', e);
    return {
      total: 0,
      transactions: [],
    };
  }
};

export const requestCacheUpdate = async (
  principalId: string,
  txnIds?: Array<bigint>
): Promise<boolean> => {
  try {
    const response = await axios.post(`${KYASHU_URL}/txn/${principalId}`, {
      pid: principalId,
      txnIds: txnIds?.map(tx => tx.toString()),
    });
    return !!response.data;
  } catch (e) {
    console.log('kyasshuu error', e);
    return false;
  }
};
