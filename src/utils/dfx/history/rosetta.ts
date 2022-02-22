/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import fetch from 'cross-fetch';
import { TOKENS } from '../../../constants/tokens';
import { ERRORS } from '../../../errors';
import { NET_ID, ROSETTA_URL } from '../constants';

import { InferredTransaction, GetTransactionsResponse } from '../../../interfaces/transactions';

export const MILI_PER_SECOND = 1000000;

interface Operation {
  account: {
    address: string;
  };
  amount: {
    value: string;
    currency: {
      symbol: string;
      decimals: number;
    };
  };
  status: 'COMPLETED' | 'REVERTED' | 'PENDING';
  type: 'TRANSACTION' | 'FEE';
}

interface Balance {
  value: string;
  decimals: number;
  error?: string;
};

interface RosettaTransaction {
  metadata: {
    block_height: number;
    memo: number;
    timestamp: number;
    lockTime: number;
  };
  operations: Operation[];
  transaction_identifier: { hash: string };
}

const getTransactionInfo = (
  accountId: string,
  rosettaTransaction: RosettaTransaction
): InferredTransaction => {
  const {
    operations,
    metadata: { timestamp },
    transaction_identifier: { hash },
  } = rosettaTransaction;
  const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
  operations.forEach(operation => {
    const value = BigInt(operation.amount.value);
    const amount = value.toString();
    if (operation.type === 'FEE') {
      transaction.details.fee.amount = amount;
      transaction.details.fee.currency = operation.amount.currency;
      return;
    }

    if (value >= 0) transaction.details.to = operation.account.address;
    if (value <= 0) transaction.details.from = operation.account.address;

    if (
      transaction.details.status === 'COMPLETED' &&
      operation.status !== 'COMPLETED'
    )
      transaction.details.status = operation.status;

    transaction.type =
      transaction.details.to === accountId ? 'RECEIVE' : 'SEND';
    transaction.details.amount = amount;
    transaction.details.currency = operation.amount.currency;
    transaction.details.canisterId = TOKENS.ICP.canisterId;
  });
  return {
    ...transaction,
    caller: transaction.details.from,
    hash,
    timestamp: timestamp / MILI_PER_SECOND,
  } as InferredTransaction;
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
    getTransactionInfo(accountId, transaction)
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
