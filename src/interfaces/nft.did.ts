/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import type { Principal } from '@dfinity/principal';

export type HeaderField = [
  string,
  string,
];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface ICPTs { 'e8s' : bigint }
export interface NFTService {
  'add_genesis_record' : () => Promise<bigint>,
  'data_of' : (arg_0: bigint) => Promise<TokenDesc>,
  'delist' : (arg_0: bigint) => Promise<boolean>,
  'get_cycles' : () => Promise<bigint>,
  'get_listed' : (arg_0: bigint) => Promise<Array<bigint>>,
  'get_storage_canister' : () => Promise<[] | [StorageActor]>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'list' : (arg_0: bigint, arg_1: bigint) => Promise<boolean>,
  'name' : () => Promise<string>,
  'owner' : () => Promise<Principal>,
  'owner_of' : (arg_0: bigint) => Promise<Principal>,
  'set_owner' : (arg_0: Principal) => Promise<boolean>,
  'set_storage_canister_id' : (arg_0: [] | [Principal]) => Promise<boolean>,
  'symbol' : () => Promise<string>,
  'total_supply' : () => Promise<bigint>,
  'transaction_notification' : (arg_0: TransactionNotification) => Promise<
      Result
    >,
  'transfer_to' : (arg_0: Principal, arg_1: bigint) => Promise<boolean>,
  'user_tokens' : (arg_0: Principal) => Promise<Array<bigint>>,
}
export type Operation = { 'init' : null } |
  { 'claim' : null } |
  { 'approve' : null } |
  { 'transfer' : null };
export interface Property { 'value' : string, 'name' : string }
export type Result = { 'Ok' : string } |
  { 'Err' : string };
export interface StorageActor {
  'addRecord' : (
      arg_0: Principal,
      arg_1: Operation,
      arg_2: [] | [Principal],
      arg_3: [] | [Principal],
      arg_4: bigint,
      arg_5: Time,
    ) => Promise<bigint>,
}
export interface StreamingCallbackHttpResponse {
  'token' : [] | [Token],
  'body' : Array<number>,
}
export type StreamingStrategy = {
    'Callback' : { 'token' : Token, 'callback' : [Principal, string] }
  };
export type Time = bigint;
export type Token = {};
export interface TokenDesc {
  'id' : bigint,
  'url' : string,
  'owner' : Principal,
  'desc' : string,
  'name' : string,
  'properties' : Array<Property>,
}
export interface TransactionNotification {
  'to' : Principal,
  'to_subaccount' : [] | [Array<number>],
  'from' : Principal,
  'memo' : bigint,
  'from_subaccount' : [] | [Array<number>],
  'amount' : ICPTs,
  'block_height' : bigint,
}
export interface StandardNFT {
  name: string;
  symbol: string;
  totalSupply: number;
  canisterId: string;
}
export default NFTService;
