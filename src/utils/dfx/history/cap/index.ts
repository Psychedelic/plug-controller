/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse, Method } from 'axios';
import { Principal } from '@dfinity/principal';
import {
  prettifyCapTransactions,
  TransactionPrettified,
} from '@psychedelic/cap-js';
import { getTokens, getAllNFTS, TokenRegistry } from '@psychedelic/dab-js';
import crossFetch from 'cross-fetch';

import { getCanisterInfo } from '../../../dab';
import { parsePrincipal, recursiveParseBigint } from '../../../object';
import { lebDecode } from '../../../crypto/binary';

import { InferredTransaction } from '../../../../interfaces/transactions';
import {
  GetCapTransactionsParams,
  GetUserTransactionResponse,
  LastEvaluatedKey,
  KyashuItem,
} from '../../../../interfaces/cap';
import { uniqueMap } from '../../../array';
import { buildSonicData, SONIC_SWAP_CANISTER_ID } from './sonic';
import { HttpAgent } from '@dfinity/agent';

const parseUnderscoreNumber = value =>
  value ? Number(value.replace('_', '')) : null;

const getTransactionCanister = (contract: string): string | undefined =>
  contract?.split('#')?.[1];

const formatTransaction = async (
  event,
  canistersInfo
): Promise<InferredTransaction> => {
  const { canisterId } = event;
  const prettifyEvent = event.prettyEvent;
  if (canisterId) {
    prettifyEvent.details = {
      ...prettifyEvent.details,
      canisterInfo: canistersInfo[canisterId],
    };
  }
  const { details, operation, time, caller } = prettifyEvent || {};
  const { amount, token, token_id, token_identifier } = details || {};
  const parsedAmount =
    amount instanceof Array && !amount.some(value => typeof value !== 'number')
      ? lebDecode(Uint8Array.from(amount as Array<number>))
      : amount;
  const tokenId =
    details?.tokenId ||
    token ||
    token_id ||
    parseUnderscoreNumber(token_identifier) ||
    '';
  const formattedTransaction = {
    hash: event.sk,
    timestamp: time,
    type: operation,
    details: {
      ...details,
      amount: parsedAmount,
      canisterId,
      tokenId,
      to: parsePrincipal(details?.to),
      from: parsePrincipal(details?.from),
      sonicData: await buildSonicData({
        canisterId,
        details,
        operation,
        canistersInfo,
        tokenId,
      }),
      // mkpData: await buildMKPData(),
    },
    caller: parsePrincipal(caller) || '',
  };

  return recursiveParseBigint(formattedTransaction);
};

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

  return [...new Set(canisterIds)].filter(value => value);
};

export const getCapTransactions = async ({
  principalId,
  lastEvaluatedKey,
  agent,
}: GetCapTransactionsParams): Promise<GetUserTransactionResponse> => {
  let total: number = 0;
  let transactions: InferredTransaction[] = [];
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
      const canisterIdsForInfo = getCanisterIds(prettifyEvents);
      const canistersInfo = await getCanistersInfo(canisterIdsForInfo, agent);
      const lastTransactions = await Promise.all(
        prettifyEvents.map(async prettyEvent =>
          formatTransaction(prettyEvent, canistersInfo)
        )
      );
      LastEvaluatedKey = response.data.LastEvaluatedKey;
      total += response.data.Count;
      transactions = [...transactions, ...lastTransactions];
    } while (LastEvaluatedKey);
  } catch (e) {
    console.error('CAP transactions error:', e);
    return {
      total: 0,
      transactions: [],
    };
  }
  return {
    total,
    transactions,
  };
};

export default {};
