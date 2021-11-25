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
import { OldMethodsExtendedActor } from '../actorFactory';

type OldXtcService = OldMethodsExtendedActor<XtcService>

const getMetadata = async (
  actor: ActorSubclass<OldXtcService>
): Promise<Metadata> => {
  const metadataResult = await actor._meta();
  return {
    fungible: {
      symbol: metadataResult.symbol,
      decimals: metadataResult.decimal,
      name: metadataResult.name,
    },
  };
};

const send = async (
  actor: ActorSubclass<OldXtcService>,
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
  actor: ActorSubclass<OldXtcService>,
  user: Principal
): Promise<Balance> => {
  const decimals = getDecimals(await getMetadata(actor));
  const value = (await actor._balance([user])).toString();
  return { value, decimals };
};

const burnXTC = async (
  actor: ActorSubclass<OldXtcService>,
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
