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

  export interface Event {
    'fee' : bigint,
    'kind' : EventDetail,
    'timestamp' : bigint,
    'cycles' : bigint,
  }
  export type EventDetail = {
      'ChargingStationDeployed' : { 'canister' : Principal }
    } |
    { 'Burn' : { 'to' : Principal, 'from' : Principal } } |
    { 'Mint' : { 'to' : Principal } } |
    { 'CanisterCreated' : { 'canister' : Principal } } |
    { 'CanisterCalled' : { 'method_name' : string, 'canister' : Principal } } |
    { 'Transfer' : { 'to' : Principal, 'from' : Principal } };
  export interface EventsConnection {
    'data' : Array<Event>,
    'next_canister_id' : [] | [Principal],
  }
  export default interface _SERVICE {
  'meta' : () => Promise<TokenMetaData>,
  'meta_certified' : () => Promise<TokenMetaData>,
  'balance' : (arg_0: [] | [Principal]) => Promise<bigint>,
  'transfer' : (
      arg_0: {
        'to' : Principal,
        'notify' : [] | [NotifyArgs],
        'from' : [] | [Principal],
        'amount' : bigint,
      },
    ) => Promise<TransferResult>,
  'events' : (arg_0: { 'after' : [] | [bigint], 'limit' : number }) => Promise<
    EventsConnection
  >,
}

