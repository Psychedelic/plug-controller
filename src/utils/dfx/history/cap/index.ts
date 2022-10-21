/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse, Method } from 'axios';
import {
  prettifyCapTransactions,
  TransactionPrettified,
} from '@psychedelic/cap-js';
import { getTokens, getAllNFTS, TokenRegistry } from '@psychedelic/dab-js';

import { getCanisterInfo } from '../../../dab';
import { parsePrincipal } from '../../../object';
import {
  GetCapTransactionsParams,
  GetUserTransactionResponse,
  LastEvaluatedKey,
} from '../../../../interfaces/cap';
import { SONIC_SWAP_CANISTER_ID } from './sonic';
import { HttpAgent } from '@dfinity/agent';
import { formatCapTransaction } from '../../../formatter/transaction/capTransactionFormatter';


const parseUnderscoreNumber = value =>
  value ? Number(value.replace('_', '')) : null;

const getTransactionCanister = (contract: string): string | undefined =>
  contract?.split('#')?.[1];

const metadataArrayToObject = metadata =>
  metadata.reduce(
    (acum, item) => ({ ...acum, [item.principal_id.toString()]: item }),
    {}
  );

const getCanistersInfo = async (
  canisterIds: string[],
  agent?: HttpAgent
): Promise<any> => {
  const dabTokensInfo = metadataArrayToObject(await getTokens({ agent }));
  const dabNFTsInfo = metadataArrayToObject(await getAllNFTS({ agent }));
  const dabInfo = await Promise.all(
    canisterIds.map(async canisterId => {
      let canisterInfo = { canisterId };
      // First check if present in nft or token registries
      if (dabTokensInfo[canisterId])
        canisterInfo['tokenRegistryInfo'] = dabTokensInfo[canisterId];
      if (dabNFTsInfo[canisterId])
        canisterInfo['nftRegistryInfo'] = dabNFTsInfo[canisterId];
      try {
        // Fetch extra metadata from canister registry
        const fetchedCanisterInfo = await getCanisterInfo(canisterId, agent);
        canisterInfo = { ...canisterInfo, ...fetchedCanisterInfo };
      } catch (error) {
        /* eslint-disable-next-line */
        console.error('DAB error: ', error);
      }
      return canisterInfo;
    })
  );
  const canistersInfo = dabInfo.reduce(
    (acum, info) => ({ ...acum, [info.canisterId]: info }),
    {}
  );
  return canistersInfo;
};

const getCanisterIdsFromSonicTx = details => {
  const { to, from, token0, token1, token, token_id, token_identifier } =
    details || {};

  const tokenId =
    details?.tokenId ||
    token ||
    token_id ||
    parseUnderscoreNumber(token_identifier) ||
    undefined;

  return [to, from, token0, token1, tokenId];
};

const getCanisterIds = (
  prettyEvents: {
    canisterId: string;
    prettyEvent: TransactionPrettified;
  }[]
) => {
  const canisterIds = prettyEvents.reduce(
    (acum, { canisterId, prettyEvent }) => {
      if (canisterId === SONIC_SWAP_CANISTER_ID) {
        return acum
          .concat([canisterId])
          .concat(getCanisterIdsFromSonicTx(prettyEvent.details));
      } else {
        return acum.concat([canisterId]);
      }
    },
    [] as string[]
  );
  return [...new Set(canisterIds.map((id) => parsePrincipal(id)))].filter(value => value);
};

export const getCapTransactions = async ({
  principalId,
  lastEvaluatedKey,
  agent,
}: GetCapTransactionsParams): Promise<GetUserTransactionResponse> => {
  let total: number = 0;
  let events: { sk: string, canisterId: string, prettyEvent: TransactionPrettified }[] = [];
  let LastEvaluatedKey: LastEvaluatedKey | undefined = lastEvaluatedKey;
  try {
    do {
      const options = {
        method: 'get' as Method,
        url: `https://kyasshu.fleek.co/cap/user/txns/${principalId}`,
        ...(LastEvaluatedKey
          ? {
              params: {
                LastEvaluatedKey,
              },
            }
          : {}),
      };
      const response = await axios(options);
      const prettifyEvents = response.data.Items.map(item => ({
        sk: item.sk,
        canisterId: getTransactionCanister(item.contractId),
        prettyEvent: prettifyCapTransactions(item.event),
      }));
      LastEvaluatedKey = response.data.LastEvaluatedKey;
      total += response.data.Count;
      events = [...events, ...prettifyEvents];
    } while (LastEvaluatedKey);
  } catch (e) {
    console.error('CAP transactions error:', e);
    return {
      total: 0,
      transactions: [],
    };
  }
  // Keep only last 50 txs by timestamp
  const lastEvents = events.sort(
    (a, b) => (a.prettyEvent.time < b.prettyEvent.time)
      ? -1
      : ((a.prettyEvent.time > b.prettyEvent.time)
          ? 1
          : 0
        ),
    ).slice(-50);
  const canistersInfo = await getCanistersInfo(getCanisterIds(lastEvents), agent);
  const transactions = await Promise.all(
      lastEvents.map(async prettyEvent =>
        formatCapTransaction(prettyEvent, canistersInfo)
      )
    );
  return {
    total: total >= 50 ? 50 : total,
    transactions,
  };
};

export default {};
