import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import { Metadata } from '../../../interfaces/ext';
import { BurnResult } from '../../../interfaces/xtc';
import { BaseMethodsExtendedActor } from '../actorFactory';

export type SendResponse =
  | { height: string }
  | { amount: string }
  | { transactionId: string };

export interface SendParams {
  to: string;
  from: string;
  amount: string;
}

export interface BurnParams {
  to: Principal;
  amount: string;
}

export interface Balance {
  value: string;
  decimals: number;
}

interface AddedMehtodsToken {
  send: ({ to, from, amount }: SendParams) => Promise<SendResponse>;
  getMetadata: () => Promise<Metadata>;
  getBalance: (user: Principal) => Promise<Balance>;
  burnXTC: ({ to, amount }: BurnParams) => Promise<BurnResult>;
}

export type TokenServiceExtended<T> = BaseMethodsExtendedActor<T> & AddedMehtodsToken

export interface InternalTokenMethods {
  send: (
    actor: ActorSubclass<any>,
    { to, from, amount }: SendParams
  ) => Promise<SendResponse>;
  getMetadata: (actor: ActorSubclass<any>) => Promise<Metadata>;
  getBalance: (actor: ActorSubclass<any>, user: Principal) => Promise<Balance>;
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
): Promise<Balance> => {
  throw Error('Standard Not Implemented');
};

const burnXTC = async (_actor: ActorSubclass<any>, _params: BurnParams) => {
  throw Error('Standard Not Implemented');
};

export const getDecimals = (metadata: Metadata): number => {
  return 'fungible' in metadata ? metadata.fungible.decimals : 0;
};

export const parseAmountToSend = (amount: string, decimals: number): bigint => {
  const commaIndex = amount.indexOf(".");
  const integerPart = commaIndex === -1 ? amount : amount.substring(0, commaIndex);
  const decimalPart = commaIndex === -1 ? '' : amount.substring(commaIndex + 1);
  const zeros = commaIndex == -1 ? '0'.repeat(decimals) : decimalPart.length < decimals ? '0'.repeat(decimals - decimalPart.length) : '';
  return BigInt(`${integerPart}${decimalPart}${zeros}`);
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
} as InternalTokenMethods;
