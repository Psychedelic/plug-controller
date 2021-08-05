/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import type { Principal } from '@dfinity/agent';

export interface NotifyArgs {
  'canister_id' : Principal,
  'method_name' : string,
}
export interface TokenMetaData {
  'features' : Array<string>,
  'name' : string,
  'decimal' : number,
  'symbol' : string,
}
export interface StandardToken extends TokenMetaData {
  canisterId: string;
}

export interface TokenBalance {
  name: string;
  symbol: string;
  amount: bigint;
}

export type TransactionId = bigint;
export type TransferError = { 'CallFailed' : null } |
  { 'InsufficientBalance' : null } |
  { 'Unknown' : null } |
  { 'AmountTooLarge' : null };
export type TransferResult = { 'Ok' : TransactionId } |
  { 'Err' : TransferError };
export default interface _SERVICE {
  'allowance' : (
      arg_0: { 'account' : Principal, 'spender' : [] | [Principal] },
    ) => Promise<bigint>,
  'approval' : (arg_0: { 'amount' : bigint, 'spender' : Principal }) => Promise<
      undefined
    >,
  'balance' : (arg_0: [] | [Principal]) => Promise<{ 'amount' : bigint }>,
  'compute_fee' : (arg_0: bigint) => Promise<bigint>,
  'meta' : () => Promise<TokenMetaData>,
  'meta_certified' : () => Promise<TokenMetaData>,
  'total_supply' : () => Promise<bigint>,
  'transfer' : (
      arg_0: {
        'to' : Principal,
        'from' : [] | [Principal],
        'amount' : bigint,
      },
    ) => Promise<TransferResult>,
}