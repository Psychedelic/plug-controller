/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import fetch from 'cross-fetch';
import { Principal } from '@dfinity/principal';

import { GetTransactionsResponse, InferredTransaction } from './rosetta';

const KYASHU_URL = 'https://ikbsza5one.execute-api.us-west-2.amazonaws.com/dev';

type TransactionKind =
  | {
      Burn: {
        to: { _isPrincipal: boolean; _arr: Uint8Array };
        from: { _isPrincipal: boolean; _arr: Uint8Array };
      };
    }
  | { Mint: { to: { _isPrincipal: boolean; _arr: Uint8Array } } }
  | {
      CanisterCreated: {
        from: { _isPrincipal: boolean; _arr: Uint8Array };
        canister: { _isPrincipal: boolean; _arr: Uint8Array };
      };
    }
  | {
      CanisterCalled: {
        from: { _isPrincipal: boolean; _arr: Uint8Array };
        method_name: string;
        canister: { _isPrincipal: boolean; _arr: Uint8Array };
      };
    }
  | {
      Transfer: {
        to: { _isPrincipal: boolean; _arr: Uint8Array };
        from: Principal;
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
  const transaction: any = { status: 'COMPLETED', fee: {} };
  transaction.from = Principal.from(event.kind.Transfer.from).toString(); // check with @b0xtch how to instance Principal from api answer
  transaction.to = Principal.fromUint8Array(
    event.kind.Transfer.to._arr
  ).toString();
  transaction.type = transaction.to === principalId ? 'RECEIVE' : 'SEND';

  return transaction as InferredTransaction;
};

const formatBurn = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('Burn' in event.kind)) throw Error();
  const transaction: any = { status: 'COMPLETED', fee: {} };
  transaction.from = Principal.fromUint8Array(
    event.kind.Burn.from._arr
  ).toString();
  transaction.to = 'Burn';
  transaction.type = 'BURN';

  return transaction as InferredTransaction;
};

const formatMint = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('Mint' in event.kind)) throw Error();
  const transaction: any = { status: 'COMPLETED', fee: {} };
  transaction.from = 'Mint';
  transaction.to = Principal.fromUint8Array(event.kind.Mint.to._arr).toString();
  transaction.type = 'MINT';

  return transaction as InferredTransaction;
};

const formatCanisterCalled = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('CanisterCalled' in event.kind)) throw Error();
  const transaction: any = { status: 'COMPLETED', fee: {} };
  transaction.from = Principal.fromUint8Array(
    event.kind.CanisterCalled.from._arr
  ).toString();
  transaction.to = `${Principal.fromUint8Array(
    event.kind.CanisterCalled.canister._arr
  ).toString()}_${event.kind.CanisterCalled.method_name}`;
  transaction.type = 'CANISTER_CALLED';

  return transaction as InferredTransaction;
};

const formatCanisterCreated = (
  _principalId: string,
  { event }: XtcTransactions
): InferredTransaction => {
  if (!('CanisterCreated' in event.kind)) throw Error();
  const transaction: any = { status: 'COMPLETED', fee: {} };
  transaction.from = Principal.fromUint8Array(
    event.kind.CanisterCreated.from._arr
  ).toString();
  transaction.to = Principal.fromUint8Array(
    event.kind.CanisterCreated.canister._arr
  ).toString();
  transaction.type = 'CANISTER_CREATED';

  return transaction as InferredTransaction;
};

const formatXTCTrancaction = (
  principalId: string,
  xtcTransaction: XtcTransactions
): InferredTransaction => {
  const transactionEvent = xtcTransaction.event;
  const transaction: any = { status: 'COMPLETED', fee: {} };
  transaction.hash = xtcTransaction.txnId;
  transaction.amount = BigInt(transactionEvent.cycles);
  transaction.currency = { symbol: 'XTC', decimals: 5 };
  transaction.fee.amount = BigInt(transactionEvent.fee);
  transaction.fee.currency = { symbol: 'ICP', decimals: 8 };
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
  const response = await fetch(
    `${KYASHU_URL}/txns/${principalId}${
      txnIds?.length ? `?txnIds=[${txnIds.join(',')}]` : ''
    }`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  );
  const transactions = await response.json();
  return {
    total: transactions.length,
    transactions: transactions.map(transaction =>
      formatXTCTrancaction(principalId, transaction)
    ),
  } as GetTransactionsResponse;
};

export const requestCacheUpdate = async (
  principalId: string,
  txnIds?: Array<bigint>
): Promise<boolean> => {
  const response = await fetch(`${KYASHU_URL}/txn/${principalId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    body: JSON.stringify({
      txnIds: txnIds?.map(tx => tx.toString()),
    }),
  });
  return response.ok;
};
