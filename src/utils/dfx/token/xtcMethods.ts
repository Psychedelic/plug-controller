/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import XtcService, { BurnResult } from '../../../interfaces/xtc';
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

type BaseXtcService = BaseMethodsExtendedActor<XtcService>

const getMetadata = async (
  actor: ActorSubclass<BaseXtcService>
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
  actor: ActorSubclass<BaseXtcService>,
  { to, amount }: SendParams
): Promise<SendResponse> => {
  const decimals = getDecimals(await getMetadata(actor));
  const parsedAmount = parseAmountToSend(amount, decimals);

  const transferResult = await actor._transferErc20(
    Principal.fromText(to),
    parsedAmount
  );

  if ('Ok' in transferResult)
    return { transactionId: transferResult.Ok.toString() };

  throw new Error(Object.keys(transferResult.Err)[0]);
};

const getBalance = async (
  actor: ActorSubclass<BaseXtcService>,
  user: Principal
): Promise<Balance> => {
  const decimals = getDecimals(await getMetadata(actor));
  console.log('Calling balance', actor);
  const value = (await actor._balanceOf(user)).toString();
  return { value, decimals };
};

const burnXTC = async (
  actor: ActorSubclass<BaseXtcService>,
  { to, amount }: BurnParams
): Promise<BurnResult> => {
  const decimals = getDecimals(await getMetadata(actor));
  const parsedAmount = parseAmountToSend(amount, decimals);
  return actor._burn({ canister_id: to, amount: parsedAmount });
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
} as InternalTokenMethods;
