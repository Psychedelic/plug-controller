import { Principal } from '@dfinity/principal';

export type ValueType =
  | { PrincipalId: Principal }
  | { AccountId: string }
  | { Icns: string };

export interface Address {
  name: string;
  description: [] | [string];
  emoji: [] | [string];
  value: ValueType;
}

export type Error =
  | { NotAuthorized: null }
  | { BadParameters: null }
  | { Unknown: string }
  | { NonExistentItem: null };

export type Response = { Ok: [] | [string] } | { Err: Error };
