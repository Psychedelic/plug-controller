import { DABCollection, getUserCollectionTokens } from "@psychedelic/dab-js";
import { Principal } from '@dfinity/principal';

export const getTokensFromCollections = async (customNfts, principal, agent) => {
    const destructuredCustomNft = customNfts.map(c => {
      return {...c, principal_id: c.canisterId};
    });
    
    const collectionWithTokens = destructuredCustomNft.map(async (c) => {
      const cDABCollection: DABCollection = {
        ...c,
        principal_id: Principal.fromText(c.principal_id),
        icon: c.icon || '',
        description: c.description || '',
      }

      const tokens = getUserCollectionTokens(cDABCollection, Principal.fromText(principal), agent);
      return tokens
    });

    const resultCollectionWithTokens = await Promise.all(collectionWithTokens);

    return resultCollectionWithTokens;
  }