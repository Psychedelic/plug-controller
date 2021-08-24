import { HttpAgent, ActorSubclass, Actor } from '@dfinity/agent';

import NFTIdls from '../../../idls/nft.did';
import NFTService from '../../../interfaces/nft';

export const createNFTActor = (
  agent: HttpAgent,
  canisterId: string
): ActorSubclass<NFTService> => {
  return Actor.createActor<ActorSubclass<NFTService>>(NFTIdls, {
    agent,
    canisterId,
  });
};

export default createNFTActor;
