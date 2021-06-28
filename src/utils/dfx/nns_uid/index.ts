import { HttpAgent, ActorSubclass } from '@dfinity/agent';

import nnsMethods, { NNSServiceExtended } from './methods';
import { createExtendedActorClass } from '../actorFactory';
import { NNS_CANISTER_ID } from '../constants';
import nnsIDLFactory from '../../../idls/nns_uid.did';

export const createNNSActor = (
  agent: HttpAgent
): ActorSubclass<NNSServiceExtended> => {
  return (new (createExtendedActorClass(
    agent,
    nnsMethods,
    NNS_CANISTER_ID,
    nnsIDLFactory
  ))() as unknown) as ActorSubclass<NNSServiceExtended>;
};

export default createNNSActor;
