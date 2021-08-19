/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import type { Principal } from '@dfinity/principal';

export interface NotifyArgs {
  'canister_id': Principal,
  'method_name': string,
}
export interface TokenMetaData {
  'features': Array<string>,
  'name': string,
  'decimal': number,
  'symbol': string,
}
export interface StandardToken extends TokenMetaData {
  canisterId: string;
}

export interface TokenBalance {
  name: string;
  symbol: string;
  amount: bigint;
  canisterId: string | null;
}

export type TransactionId = bigint;
export type BurnError = { 'InsufficientBalance': null } |
  { 'InvalidTokenContract': null } |
  { 'NotSufficientLiquidity': null }

export type BurnResult = { 'Ok': TransactionId } | { 'Err': BurnError };

export type TransferError = { 'CallFailed': null } |
{ 'InsufficientBalance': null } |
{ 'Unknown': null } |
{ 'AmountTooLarge': null };
export type TransferResult = { 'Ok': TransactionId } |
{ 'Err': TransferError };
export default interface _SERVICE {
  'meta': () => Promise<TokenMetaData>,
  'meta_certified': () => Promise<TokenMetaData>,
  'balance': (arg_0: [] | [Principal]) => Promise<bigint>,
  'burn': (arg_0: {
    canister_id: Principal,
    amount: bigint
  }) => Promise<BurnResult>
  'transfer': (
    arg_0: {
      'to': Principal,
      'from': [] | [Principal],
      'amount': bigint,
    },
  ) => Promise<TransferResult>,
}