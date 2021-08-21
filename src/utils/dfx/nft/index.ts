import { HttpAgent, ActorSubclass, Actor } from '@dfinity/agent';

import NFTIdls from '../../../idls/nft';
import { NFTService } from '../../../interfaces/nft.did';

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
