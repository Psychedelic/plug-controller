import {
  getCanisterInfo as getCanisterInfoFromDab,
  getMultipleCanisterInfo as getMultipleCanisterInfoFromDab,
} from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import fetch from 'cross-fetch';

import { Principal } from '@dfinity/principal';
import { IC_HOST } from './dfx/constants';

export interface CanisterInfo {
  name: string;
  description: string;
  icon: string;
}

export const getCanisterInfo = async (
  canisterId: string,
  agent?: HttpAgent
): Promise<CanisterInfo | undefined> => {
  const finalAgent =
    agent || new HttpAgent({ host: process.env.DFX_HOST || IC_HOST, fetch });

  const result = await getCanisterInfoFromDab(canisterId, finalAgent);
  if (result) return { ...result, icon: result.logo_url };
  return undefined;
};

export const getMultipleCanisterInfo = async (
  canisterIds: string[],
  agent?: HttpAgent
): Promise<CanisterInfo[]> => {
  const finalAgent =
    agent || new HttpAgent({ host: process.env.DFX_HOST || IC_HOST, fetch });

  const result = await getMultipleCanisterInfoFromDab(
    canisterIds.map(id => Principal.from(id)),
    finalAgent
  );

  return result.map(canisterMetadata => ({
    ...canisterMetadata,
    icon: canisterMetadata.logo_url,
  }));
};
