/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';

import { GetTransactionsResponse, InferredTransaction } from './rosetta';

const KYASHU_URL =
  'https://gxdmhoifte.execute-api.us-west-2.amazonaws.com/prod';

type TransactionKind =
  | {
      Burn: {
        to: string;
        from: string;
      };
    }
  | { Mint: { to: string } }
  | {
      CanisterCreated: {
        from: string;
        canister: string;
      };
    }
  | {
      CanisterCalled: {
        from: string;
        method_name: string;
        canister: string;
      };
    }
  | {
      Transfer: {
        to: string;
        from: string;
      };
    };

interface XtcTransactions {
  txnId: string;
  event: {
    cycles: number;
    kind: TransactionKind;
    fee: number;
    timestamp: number;
  };
}

const formatTransfer = (
  principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('Transfer' in event.kind)) throw Error();
  const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
  transaction.details.from = event.kind.Transfer.from; // check with @b0xtch how to instance Principal from api answer
  transaction.details.to = event.kind.Transfer.to;
  transaction.caller = event.kind.Transfer.from;
  transaction.type =
    transaction.details.to === principalId ? 'RECEIVE' : 'SEND';

  return transaction as InferredTransaction;
};

const formatBurn = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('Burn' in event.kind)) throw Error();
  const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
  transaction.details.from = event.kind.Burn.from;
  transaction.details.to = event.kind.Burn.to;
  transaction.caller = event.kind.Burn.from;
  transaction.type = 'BURN';

  return transaction as InferredTransaction;
};

const formatMint = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('Mint' in event.kind)) throw Error();
  const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
  transaction.details.from = 'Mint';
  transaction.details.to = event.kind.Mint.to;
  transaction.caller = _principalId;
  transaction.type = 'MINT';

  return transaction as InferredTransaction;
};

const formatCanisterCalled = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('CanisterCalled' in event.kind)) throw Error();
  const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
  transaction.details.from = event.kind.CanisterCalled.from;
  transaction.caller = event.kind.CanisterCalled.from;
  transaction.details.to = `${event.kind.CanisterCalled.canister}_${event.kind.CanisterCalled.method_name}`;
  transaction.type = 'CANISTER_CALLED';

  return transaction as InferredTransaction;
};

const formatCanisterCreated = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('CanisterCreated' in event.kind)) throw Error();
  const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
  transaction.details.from = event.kind.CanisterCreated.from;
  transaction.caller = event.kind.CanisterCreated.from;
  transaction.details.to = event.kind.CanisterCreated.canister;
  transaction.type = 'CANISTER_CREATED';

  return transaction as InferredTransaction;
};

const formatXTCTransaction = (
  principalId: string,
  xtcTransaction: XtcTransactions
): InferredTransaction => {
  const transactionEvent = xtcTransaction.event;
  const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
  transaction.hash = xtcTransaction.txnId;
  transaction.details.amount = BigInt(transactionEvent.cycles);
  transaction.details.currency = { symbol: 'XTC', decimals: 5 };
  transaction.details.fee.amount = BigInt(transactionEvent.fee);
  transaction.details.fee.currency = { symbol: 'XTC', decimals: 5 };
  transaction.timestamp = xtcTransaction.event.timestamp;
  switch (Object.keys(transactionEvent.kind)[0]) {
    case 'Transfer':
      return { ...formatTransfer(principalId, xtcTransaction), ...transaction };
    case 'Burn':
      return { ...formatBurn(principalId, xtcTransaction), ...transaction };
    case 'Mint':
      return { ...formatMint(principalId, xtcTransaction), ...transaction };
    case 'CanisterCalled':
      return {
        ...formatCanisterCalled(principalId, xtcTransaction),
        ...transaction,
      };
    case 'CanisterCreated':
      return {
        ...formatCanisterCreated(principalId, xtcTransaction),
        ...transaction,
      };
    default:
      throw Error;
  }
};

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
      body: {
        txnIds: txnIds?.map(tx => tx.toString()),
      },
    });
    return !!response.data;
  } catch (e) {
    console.log('kyasshuu error', e);
    return false;
  }
};
