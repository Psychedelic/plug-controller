/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';

export type AccountIdentifier = string;

export type TokenIdentifier = string;

export type Balance = bigint;

export type SubAccount = number[];

export type Memo = number[];

export type Fee = bigint;

export type User =
  | {
      addres?: AccountIdentifier; // No notification
    }
  | {
      principal?: Principal; // default to sub account 0
    };

export interface ResultOk<T> {
  ok: T;
}

export interface ResultError<T> {
  error: T;
}

export type Result<Ok, Error> = ResultOk<Ok> | ResultError<Error>;
export interface NotifyArgs {
  canister_id: Principal;
  method_name: string;
}
export interface TokenMetaData {
  name: string;
  decimals: number;
  symbol: string;
}
export interface StandardToken extends TokenMetaData {
  canisterId: string;
}

export type CommonError =
  | {
      InvalidToken: TokenIdentifier;
    }
  | {
      Other: string;
    };

export interface TokenBalance {
  name: string;
  symbol: string;
  amount: bigint;
  canisterId: string | null;
}

export type Extension = string;

export interface BalanceRequest {
  user: User;
  token: TokenIdentifier;
}
export type BalanceResponse = Result<Balance, CommonError>;

export type TransactionId = bigint;
export type TransferError =
  | { Unauthorized: AccountIdentifier }
  | { InsufficientBalance: null }
  | { Rejected: null }
  | { InvalidToken: TokenIdentifier }
  | { CannotNotify: AccountIdentifier }
  | { Other: string };
export interface TransferRequest {
  to: User;
  from: User;
  token: TokenIdentifier;
  amount: number;
  memo: Memo;
  notify: boolean;
  subacount?: SubAccount;
  fee: Fee;
}
export type TransferResponse = Result<Balance, TransferError>;

export interface FungibleMetadata {
  fungible: TokenMetaData & {
    metadata?: BinaryBlob;
  };
}
export interface NonFungibleMetadata {
  nonfungible: {
    metadata: BinaryBlob;
  };
}
export type Metadata = FungibleMetadata | NonFungibleMetadata;
export type MetadataResponse = Result<Metadata, CommonError>;

export type SupplyResponse = Result<Balance, CommonError>;

export default interface _SERVICE {
  extensions: () => Promise<Extension[]>;
  balance: (arg_0: BalanceRequest) => Promise<BalanceResponse>;
  transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
  metadata: (token: TokenIdentifier) => Promise<MetadataResponse>;
  supply: (token: TokenIdentifier) => Promise<SupplyResponse>;
}
