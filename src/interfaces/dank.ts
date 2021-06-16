import type { Principal } from '@dfinity/agent/lib/cjs';
export interface AllowanceRule {
  'max_portion' : [] | [bigint],
  'max_allowed_calls_per_day' : [] | [number],
  'stop_threshold' : [] | [bigint],
  'max_cycles' : [] | [bigint],
};
export interface Event {
  'fee' : bigint,
  'status' : TransactionStatus,
  'detail' : EventDetail,
  'timestamp' : bigint,
  'amount' : bigint,
};
export type EventDetail = {
    'Withdraw' : { 'to' : Principal, 'from' : Principal }
  } |
  { 'ChargingStationDeployed' : { 'canister' : Principal } } |
  { 'Deposit' : { 'to' : Principal } } |
  { 'CanisterCreated' : { 'canister' : Principal } } |
  { 'CanisterCalled' : { 'method_name' : string, 'canister' : Principal } } |
  { 'Transfer' : { 'to' : Principal, 'from' : Principal } };
export interface EventsConnection {
  'data' : Array<Event>,
  'next_canister_id' : [] | [Principal],
};
export type GetTransactionResult = { 'None' : null } |
  { 'Some' : Event };
export type ResultCall = { 'Ok' : { 'return' : Array<number> } } |
  { 'Err' : string };
export type TransactionId = bigint;
export type TransactionStatus = { 'InternalError' : null } |
  { 'Completed' : null } |
  { 'Pending' : null } |
  { 'InsufficientFunds' : null };
export type TransferError = { 'InsufficientBalance' : null } |
  { 'InternalError' : string } |
  { 'AmountTooLarge' : null };
export type TransferResponse = { 'Ok' : TransactionId } |
  { 'Err' : TransferError };
export type WithdrawError = { 'InsufficientBalance' : null } |
  { 'InternalError' : string } |
  { 'AmountTooLarge' : null };
export type WithdrawResult = { 'Ok' : TransactionId } |
  { 'Err' : WithdrawError };
export default interface _SERVICE {
  'allow' : (
      arg_0: { 'rule' : AllowanceRule, 'canister_id' : Principal },
    ) => Promise<undefined>,
  'balance' : (arg_0: [] | [Principal]) => Promise<bigint>,
  'deposit' : (arg_0: [] | [Principal]) => Promise<TransactionId>,
  'disallow' : (arg_0: Principal) => Promise<undefined>,
  'events' : (arg_0: { 'after' : [] | [number], 'limit' : number }) => Promise<
      EventsConnection
    >,
  'get_transaction' : () => Promise<GetTransactionResult>,
  'name' : () => Promise<string>,
  'request_withdraw' : () => Promise<undefined>,
  'transfer' : (arg_0: { 'to' : Principal, 'amount' : bigint }) => Promise<
      TransferResponse
    >,
  'wallet_call' : (
      arg_0: {
        'args' : Array<number>,
        'cycles' : bigint,
        'method_name' : string,
        'canister' : Principal,
      },
    ) => Promise<ResultCall>,
  'withdraw' : (
      arg_0: { 'canister_id' : Principal, 'amount' : bigint },
    ) => Promise<WithdrawResult>,
};
