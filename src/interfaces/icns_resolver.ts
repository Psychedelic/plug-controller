/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/class-name-casing */
import { Principal } from '@dfinity/principal';

export interface DefaultInfoExt {
  btc: [] | [string];
  eth: [] | [string];
  icp: [] | [string];
  pid: [] | [Principal];
  url: [] | [string];
  twitter: [] | [string];
  host: [] | [{ url: string } | { canister: Principal }];
  canisterExtensions: Array<[string, Principal]>;
  description: [] | [string];
  email: [] | [string];
  textExtensions: Array<[string, string]>;
  addrExtensions: Array<[string, string]>;
  discord: [] | [string];
  mainCanister: [] | [Principal];
  telegram: [] | [string];
  github: [] | [string];
  avatar: [] | [string];
}
export interface ICNSResolver {
  getAddr: (arg_0: string, arg_1: string) => Promise<[] | [string]>;
  getCanister: (arg_0: string, arg_1: string) => Promise<[] | [Principal]>;
  getExtensionLimit: () => Promise<bigint>;
  getHost: (
    arg_0: string
  ) => Promise<[] | [{ url: string } | { canister: Principal }]>;
  getInfo: () => Promise<Info>;
  getLengthLimit: () => Promise<bigint>;
  getText: (arg_0: string, arg_1: string) => Promise<[] | [string]>;
  getUserDefaultInfo: (arg_0: string) => Promise<[] | [DefaultInfoExt]>;
  setAddr: (
    arg_0: string,
    arg_1: string,
    arg_2: [] | [string]
  ) => Promise<Result>;
  setCanister: (
    arg_0: string,
    arg_1: string,
    arg_2: [] | [Principal]
  ) => Promise<Result>;
  setExtensionLimit: (arg_0: bigint) => Promise<bigint>;
  setHost: (
    arg_0: string,
    arg_1: [] | [{ url: string } | { canister: Principal }]
  ) => Promise<Result>;
  setLengthLimit: (arg_0: bigint) => Promise<bigint>;
  setText: (
    arg_0: string,
    arg_1: string,
    arg_2: [] | [string]
  ) => Promise<Result>;
}
export interface Info {
  extensionLimit: bigint;
  memSize: bigint;
  heapSize: bigint;
  maxRecordLength: bigint;
  entries: bigint;
  cycles: bigint;
}
export type Result = { ok: null } | { err: string };

export default interface _SERVICE extends ICNSResolver {}
