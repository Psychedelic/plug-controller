/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import fetch from 'cross-fetch';
import { TOKENS } from '../../../constants/tokens';
import { ERRORS } from '../../../errors';
import { NET_ID, ROSETTA_URL } from '../constants';

import { GetTransactionsResponse } from '../../../interfaces/transactions';
import { formatIcpTransaccion } from '../../formatter/transaction/ipcTransactionFormatter';

export const MILI_PER_SECOND = 1000000;

interface Balance {
  value: string;
  decimals: number;
  error?: string;
};

export const getICPTransactions = async (
  accountId: string
): Promise<GetTransactionsResponse> => {
  const response = await fetch(`${ROSETTA_URL}/search/transactions`, {
    method: 'POST',
    body: JSON.stringify({
      network_identifier: NET_ID,
      account_identifier: {
        address: accountId,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });
  if (!response.ok)
    throw Error(`${ERRORS.GET_TRANSACTIONS_FAILS} ${response.statusText}`);
  const { transactions, total_count } = await response.json();
  const transactionsInfo = transactions.map(({ transaction }) =>
    formatIcpTransaccion(accountId, transaction)
  );
  return {
    total: total_count,
    transactions: transactionsInfo,
  };
};

export const getICPBalance = async (accountId: string): Promise<Balance> => {
  const response = await fetch(`${ROSETTA_URL}/account/balance`, {
    method: 'POST',
    body: JSON.stringify({
      network_identifier: NET_ID,
      account_identifier: {
        address: accountId,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });
  if (!response.ok) {
    return { value: 'Error', decimals: TOKENS.ICP.decimals, error: response.statusText };
  }
  const { balances } = await response.json();
  const [{ value, currency }] = balances;
  return { value, decimals: currency.decimals };
};

export default {};
