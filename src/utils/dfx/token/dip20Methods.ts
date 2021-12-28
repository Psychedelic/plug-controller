/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import Dip20Service from '../../../interfaces/dip20';
import { Metadata } from '../../../interfaces/ext';
import {
  Balance,
  BurnParams,
  getDecimals,
  InternalTokenMethods,
  parseAmountToSend,
  SendParams,
  SendResponse,
} from './methods';
import { BaseMethodsExtendedActor } from '../actorFactory';

type BaseDip20Service = BaseMethodsExtendedActor<Dip20Service>;

const getMetadata = async (
  actor: ActorSubclass<BaseDip20Service>
): Promise<Metadata> => {
  const metadataResult = await actor._getMetadata();
  return {
    fungible: {
      symbol: metadataResult.symbol,
      decimals: metadataResult.decimals,
      name: metadataResult.name,
    },
  };
};

const send = async (
  actor: ActorSubclass<BaseDip20Service>,
  { to, amount }: SendParams
): Promise<SendResponse> => {
  const decimals = getDecimals(await getMetadata(actor));

  const parsedAmount = parseAmountToSend(amount, decimals);

  const transferResult = await actor._transfer(
    Principal.fromText(to),
    parsedAmount
  );

  if ('Ok' in transferResult) {
    return { transactionId: transferResult.Ok.toString() };
  }

  const error = Object.keys(transferResult.Err)[0];
  throw new Error(error);
};

const getBalance = async (
  actor: ActorSubclass<BaseDip20Service>,
  user: Principal
): Promise<Balance> => {
  const decimals = getDecimals(await getMetadata(actor));
  const value = (await actor._balanceOf(user)).toString();
  return { value, decimals };
};

const burnXTC = async (
  _actor: ActorSubclass<BaseDip20Service>,
  _params: BurnParams
) => {
  throw new Error('BURN NOT SUPPORTED');
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
} as InternalTokenMethods;
