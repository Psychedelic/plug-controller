import { HttpAgent, ActorSubclass } from '@dfinity/agent';

import { createExtendedActorClass } from '../actorFactory';
import tokenMethods, { TokenServiceExtended } from './methods';
import extIDL from '../../../idls/ext.did';

export const createTokenActor = async (
  canisterId: string,
  agent: HttpAgent
): Promise<ActorSubclass<TokenServiceExtended>> => {
  const actor = (new (createExtendedActorClass(
    agent,
    tokenMethods,
    canisterId,
    extIDL
  ))() as unknown) as ActorSubclass<TokenServiceExtended>;
  return actor;
};

export default {};

export { SendResponse } from './methods';
