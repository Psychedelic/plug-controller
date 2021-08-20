/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

import fetch from 'cross-fetch';
import { ERRORS } from '../../../errors';
import { NET_ID, ROSETTA_URL } from '../constants';

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

interface Currency {
  symbol: string;
  decimals: number;
}

interface RosettaTransaction {
  metadata: { block_height: number; memo: number; timestamp: number };
  operations: Operation[];
  transaction_identifier: { hash: string };
}

export interface InferredTransaction {
  hash: string;
  from: string;
  to: string;
  amount: bigint;
  currency: Currency;
  fee: {
    amount: bigint;
    currency: Currency;
  };
  timestamp: number;
  status: 'COMPLETED' | 'REVERTED' | 'PENDING';
  type: 'SEND' | 'RECEIVE' | 'BURN' | 'MINT';
}

export interface GetTransactionsResponse {
  total: number;
  transactions: InferredTransaction[];
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
  const transaction: any = { status: 'COMPLETED', fee: {} };
  operations.forEach(operation => {
    const amount = BigInt(operation.amount.value);
    if (operation.type === 'FEE') {
      transaction.fee.amount = amount;
      transaction.fee.currency = operation.amount.currency;
      return;
    }

    if (amount > 0) transaction.to = operation.account.address;
    if (amount < 0) transaction.from = operation.account.address;
    if (transaction.status === 'COMPLETED' && operation.status !== 'COMPLETED')
      transaction.status = operation.status;

    transaction.type = transaction.to === accountId ? 'RECEIVE' : 'SEND';
    transaction.amount = amount;
    transaction.currency = operation.amount.currency;
  });
  return { ...transaction, hash, timestamp } as InferredTransaction;
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

export default {};
