import {
  getCanisterInfo as getCanisterInfoFromDab,
  getMultipleCanisterInfo as getMultipleCanisterInfoFromDab,
} from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import crossFetch from 'cross-fetch';

import { PLUG_PROXY_HOST } from './dfx/constants';
import { wrappedFetch } from './dfx/wrappedFetch';

export interface CanisterInfo {
  name: string;
  description: string;
  icon: string;
}

export const getCanisterInfo = async ({
  canisterId,
  agent,
  fetch,
} : {
  canisterId: string,
  agent?: HttpAgent,
  fetch?: typeof crossFetch,
}
): Promise<CanisterInfo | undefined> => {
  const finalAgent =
    agent ||
    new HttpAgent({
      host: process.env.DFX_HOST || PLUG_PROXY_HOST,
      fetch: wrappedFetch(fetch),
    });

  const result = await getCanisterInfoFromDab({
    canisterId,
    agent: finalAgent,
  });
  if (result) return { ...result, icon: result.logo_url };
  return undefined;
};

export const getMultipleCanisterInfo = async (
  canisterIds: string[],
  agent?: HttpAgent
): Promise<CanisterInfo[]> => {
  const finalAgent =
    agent ||
    new HttpAgent({
      host: process.env.DFX_HOST || PLUG_PROXY_HOST,
      fetch: wrappedFetch(),
    });

  const result = await getMultipleCanisterInfoFromDab({
    canisterIds: canisterIds.map(id => Principal.from(id)),
    agent: finalAgent,
  });

  return result.map(canisterMetadata => ({
    ...canisterMetadata,
    icon: canisterMetadata.logo_url,
  }));
};
