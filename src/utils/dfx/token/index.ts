import { HttpAgent, ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import { createExtendedActorClass } from '../actorFactory';
import tokenMethods, { TokenServiceExtended } from './methods';
import extIDL from '../../../idls/ext.did';
import xtcIDL from '../../../idls/xtc.did';
import { XTC_ID } from '../constants';

export const createTokenActor = async (
  canisterId: string | Principal,
  agent: HttpAgent
): Promise<ActorSubclass<TokenServiceExtended>> => {
  const idl = canisterId === XTC_ID ? xtcIDL : extIDL;
  const actor = (new (createExtendedActorClass(
    agent,
    tokenMethods,
    canisterId,
    idl
  ))() as unknown) as ActorSubclass<TokenServiceExtended>;
  return actor;
};

export default {};

export { SendResponse } from './methods';
