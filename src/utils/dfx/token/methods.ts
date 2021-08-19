import { Actor, ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import extMethods from './extMethods';
import xtcMethods from './xtcMethods';

import ExtService, { Metadata } from '../../../interfaces/ext';
import XtcService from '../../../interfaces/xtc';
import { XTC_ID } from '../constants';

export type SendResponse =
  | { height: bigint }
  | { amount: bigint }
  | { transactionId: bigint };

export interface TokenServiceExtended {
  send: (to: string, from: string, amount: bigint) => Promise<SendResponse>;
  getMetadata: () => Promise<Metadata>;
  getBalance: (user: Principal) => Promise<bigint>;
}

const send = async (
  actor: ActorSubclass<ExtService | XtcService>,
  to: string,
  from: string,
  amount: bigint
): Promise<SendResponse> => {
  const token = Actor.canisterIdOf(actor).toText();

  switch (token) {
    case XTC_ID:
      return {
        transactionId: await xtcMethods.send(
          actor as ActorSubclass<XtcService>,
          Principal.fromText(to),
          Principal.fromText(from),
          amount
        ),
      };
    default:
      return {
        amount: await extMethods.send(
          actor as ActorSubclass<ExtService>,
          to,
          from,
          amount,
          token
        ),
      };
  }
};

const getMetadata = async (
  actor: ActorSubclass<ExtService | XtcService>
): Promise<Metadata> => {
  const token = Actor.canisterIdOf(actor).toText();

  switch (token) {
    case XTC_ID:
      return xtcMethods.metadata(actor as ActorSubclass<XtcService>);
    default:
      return extMethods.metadata(actor as ActorSubclass<ExtService>, token);
  }
};

const getBalance = async (
  actor: ActorSubclass<ExtService | XtcService>,
  user: Principal
): Promise<bigint> => {
  const token = Actor.canisterIdOf(actor).toText();

  switch (token) {
    case XTC_ID:
      return xtcMethods.balance(actor as ActorSubclass<XtcService>, user);
    default:
      return extMethods.balance(
        actor as ActorSubclass<ExtService>,
        token,
        user
      );
  }
};

export default { send, getMetadata, getBalance };
