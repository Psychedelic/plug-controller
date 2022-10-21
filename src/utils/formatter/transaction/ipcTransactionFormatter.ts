import { InferredTransaction, GetTransactionsResponse } from '../../../interfaces/transactions';
import { TOKENS } from '../../../constants/tokens';

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



export const formatIcpTransaccion = (
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