import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import { Metadata } from '../../../interfaces/ext';
import { BurnResult } from '../../../interfaces/xtc';

export type SendResponse =
  | { height: bigint }
  | { amount: bigint }
  | { transactionId: bigint };

export interface SendParams {
  to: string;
  from: string;
  amount: bigint;
}

export interface BurnParams {
  to: Principal;
  amount: bigint;
}
export interface TokenServiceExtended {
  send: ({ to, from, amount }: SendParams) => Promise<SendResponse>;
  getMetadata: () => Promise<Metadata>;
  getBalance: (user: Principal) => Promise<bigint>;
  burnXTC: ({ to, amount }: BurnParams) => Promise<BurnResult>;
}

export interface InternalTokenMethods {
  send: (
    actor: ActorSubclass<any>,
    { to, from, amount }: SendParams
  ) => Promise<SendResponse>;
  getMetadata: (actor: ActorSubclass<any>) => Promise<Metadata>;
  getBalance: (actor: ActorSubclass<any>, user: Principal) => Promise<bigint>;
  burnXTC: (
    actor: ActorSubclass<any>,
    { to, amount }: BurnParams
  ) => Promise<BurnResult>;
}

const send = async (
  _actor: ActorSubclass<any>,
  _params: SendParams
): Promise<SendResponse> => {
  throw Error('Standard Not Implemented');
};

const getMetadata = async (_actor: ActorSubclass<any>): Promise<Metadata> => {
  throw Error('Standard Not Implemented');
};

const getBalance = async (
  _actor: ActorSubclass<any>,
  _user: Principal
): Promise<bigint> => {
  throw Error('Standard Not Implemented');
};

const burnXTC = async (_actor: ActorSubclass<any>, _params: BurnParams) => {
  throw Error('Standard Not Implemented');
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
} as InternalTokenMethods;
