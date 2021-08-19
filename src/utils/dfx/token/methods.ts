import { Actor, ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import ExtService from '../../../interfaces/ext';
import XtcService from '../../../interfaces/xtc';
import { XTC_ID } from '../constants';

export type SendResponse = { height: bigint } | { amount: bigint };

export interface TokenServiceExtended extends ExtService {
  send: (to: string, from: string, amount: bigint) => Promise<SendResponse>;
}

const sendCustomToken = async (
  actor: ActorSubclass<ExtService | XtcService>,
  to: string,
  from: string,
  amount: bigint,
  token: string
): Promise<bigint> => {
  const dummyMemmo = new Array(32).fill(0);

  const data = {
    to: { principal: Principal.fromText(to) },
    from: { principal: Principal.from(from) },
    amount,
    token,
    memo: dummyMemmo,
    notify: false,
    subaccount: [],
    fee: BigInt(1),
  };

  const result = await (actor as ActorSubclass<ExtService>).transfer(data);

  if ('ok' in result) return result.ok;

  throw Error();
};

const send = async (
  actor: ActorSubclass<ExtService | XtcService>,
  to: string,
  from: string,
  amount: bigint
): Promise<SendResponse> => {
  const token = Actor.canisterIdOf(actor).toText();

  switch (token) {
    case XTC_ID:
      return { height: BigInt(1) };
    default:
      return { amount: await sendCustomToken(actor, to, from, amount, token) };
  }
};

export default { send };
