/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { EventDetail } from '../../../interfaces/xtc';
import axios from 'axios';
import { parseBalance } from '../token';

import { GetTransactionsResponse, InferredTransaction } from './rosetta';

const KYASHU_URL = 'https://kyasshu.fleek.co';
const XTC_DECIMALS = 12;

interface XtcTransactions {
  txnId: string;
  event: {
    cycles: number;
    kind: EventDetail;
    fee: number;
    timestamp: number;
  };
}

const formatTransfer = (
  principalId: string,
  { event }: XtcTransactions,
  details: any
): InferredTransaction => {
  if (!('Transfer' in event.kind)) throw Error();
  const transaction: any = { details };
  transaction.details.from = event.kind.Transfer.from; // check with @b0xtch how to instance Principal from api answer
  transaction.details.to = event.kind.Transfer.to;
  transaction.caller = event.kind.Transfer.from;
  transaction.type =
    transaction.details.to === principalId ? 'RECEIVE' : 'SEND';

  return transaction as InferredTransaction;
};

const formatTransferFrom = (
  principalId: string,
  { event }: XtcTransactions,
  details: any
): InferredTransaction => {
  if (!('TransferFrom' in event.kind)) throw Error();
  const transaction: any = { details };
  transaction.details.from = event.kind.TransferFrom.from; // check with @b0xtch how to instance Principal from api answer
  transaction.details.to = event.kind.TransferFrom.to;
  transaction.caller = event.kind.TransferFrom.caller;
  transaction.type =
    transaction.details.to === principalId ? 'RECEIVE' : 'SEND';

  return transaction as InferredTransaction;
};

const formatBurn = (
  _principalId: string,
  { event }: XtcTransactions,
  details: any
): InferredTransaction => {
  if (!('Burn' in event.kind)) throw Error();
  const transaction: any = { details };
  transaction.details.from = event.kind.Burn.from;
  transaction.details.to = event.kind.Burn.to;
  transaction.caller = event.kind.Burn.from;
  transaction.type = 'BURN';

  return transaction as InferredTransaction;
};

const formatApprove = (
  _principalId: string,
  { event }: XtcTransactions,
  details: any
): InferredTransaction => {
  if (!('Approve' in event.kind)) throw Error();
  const transaction: any = { details };
  transaction.details.from = event.kind.Approve.from;
  transaction.details.to = event.kind.Approve.to;
  transaction.caller = event.kind.Approve.from;
  transaction.type = 'APPROVE';

  return transaction as InferredTransaction;
};

const formatMint = (
  _principalId: string,
  { event }: XtcTransactions,
  details: any
): InferredTransaction => {
  if (!('Mint' in event.kind)) throw Error();
  const transaction: any = { details };
  transaction.details.from = 'Mint';
  transaction.details.to = event.kind.Mint.to;
  transaction.caller = _principalId;
  transaction.type = 'MINT';

  return transaction as InferredTransaction;
};

const formatCanisterCalled = (
  _principalId: string,
  { event }: XtcTransactions,
  details: any
): InferredTransaction => {
  if (!('CanisterCalled' in event.kind)) throw Error();
  const transaction: any = { details };
  transaction.details.from = event.kind.CanisterCalled.from;
  transaction.caller = event.kind.CanisterCalled.from;
  transaction.details.to = `${event.kind.CanisterCalled.canister}_${event.kind.CanisterCalled.method_name}`;
  transaction.type = 'CANISTER_CALLED';

  return transaction as InferredTransaction;
};

const formatCanisterCreated = (
  _principalId: string,
  { event }: XtcTransactions,
  details: any
): InferredTransaction => {
  if (!('CanisterCreated' in event.kind)) throw Error();
  const transaction: any = { details };
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
  const transaction: any = {};
  transaction.hash = xtcTransaction.txnId;
  transaction.timestamp = xtcTransaction.event.timestamp;
  const details = {
    amount: parseBalance({
      value: transactionEvent.cycles.toString(),
      decimals: XTC_DECIMALS,
    }),
    currency: { symbol: 'XTC', decimals: XTC_DECIMALS },
    fee: {
      amount: parseBalance({
        value: transactionEvent.fee.toString(),
        decimals: XTC_DECIMALS,
      }),
      currency: { symbol: 'XTC', decimals: XTC_DECIMALS },
    },
    status: 'COMPLETED',
  };
  switch (Object.keys(transactionEvent.kind)[0]) {
    case 'Transfer':
      return {
        ...transaction,
        ...formatTransfer(principalId, xtcTransaction, details),
      };
    case 'Burn':
      return {
        ...transaction,
        ...formatBurn(principalId, xtcTransaction, details),
      };
    case 'Mint':
      return {
        ...transaction,
        ...formatMint(principalId, xtcTransaction, details),
      };
    case 'CanisterCalled':
      return {
        ...transaction,
        ...formatCanisterCalled(principalId, xtcTransaction, details),
      };
    case 'CanisterCreated':
      return {
        ...transaction,
        ...formatCanisterCreated(principalId, xtcTransaction, details),
      };
    case 'Approve':
        return {
          ...transaction,
          ...formatApprove(principalId, xtcTransaction, details),
      };
    case 'TransferFrom':
        return {
          ...transaction,
          ...formatTransferFrom(principalId, xtcTransaction, details),
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
      body: {
        pid: principalId,
        txnIds: txnIds?.map(tx => tx.toString()),
      },
    });
    return !!response.data;
  } catch (e) {
    console.log('kyasshuu error', e);
    return false;
  }
};
