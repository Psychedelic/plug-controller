/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse, Method } from 'axios';
import { Principal } from '@dfinity/principal';
import { prettifyCapTransactions } from '@psychedelic/cap-js';
import { getTokens, getAllNFTS, TokenRegistry } from '@psychedelic/dab-js';

import { getCanisterInfo } from '../../dab';
import { recursiveParseBigint } from '../../object';
import { lebDecode } from '../../crypto/binary';

import { InferredTransaction } from '../../../interfaces/transactions';
import { uniqueMap } from '../../array';
import { XTC_ID } from '../constants';

const KYASHU_URL = 'https://kyasshu.fleek.co';

interface KyashuItem {
  contractId: string;
  event: any;
  pk: string;
  sk: string;
  userId: string;
  gs1sk: string;
  gs1pk: string;
  caller: Principal;
}

interface LastEvaluatedKey {
  pk: string;
  sk: string;
  userId: string;
}

interface KyashuResponse {
  Count: number;
  Items: KyashuItem[];
  LastEvaluatedKey: LastEvaluatedKey;
}

export interface GetUserTransactionResponse {
  total: number;
  transactions: InferredTransaction[];
  lastEvaluatedKey?: LastEvaluatedKey;
}

const parsePrincipal = pidObj =>
  pidObj?._isPrincipal
    ? Principal.fromUint8Array(
        new Uint8Array(Object.values((pidObj as any)._arr))
      ).toString()
    : pidObj;

const getTransactionCanister = (contract: string): string | undefined =>
  contract?.split('#')?.[1];

const formatTransaction = async (
  transaction: any,
  canistersInfo
): Promise<InferredTransaction> => {
  const canisterId = getTransactionCanister(transaction.contractId);
  const prettifyEvent = prettifyCapTransactions(transaction.event);
  if (canisterId) {
    prettifyEvent.details = {
      ...prettifyEvent.details,
      canisterInfo: canistersInfo[canisterId],
    };
  }
  const { details, operation, time, caller } = prettifyEvent || {};
  const { amount, token, token_id, amountIn, amountOut, token_identifier } = details || {};
  const parsedAmount =
    amount instanceof Array && !amount.some(value => typeof value !== 'number')
      ? lebDecode(Uint8Array.from(amount as Array<number>))
      : amount;
  const getHandledTokenInfo = async (principal) => {
    if (!principal) return;
    const canisterId = parsePrincipal(principal);
    if (canistersInfo[canisterId]?.tokenRegistryInfo) return canistersInfo[canisterId]?.tokenRegistryInfo;
    else {
      const registry = new TokenRegistry();
      const data = await registry.get(canisterId);
      return data;
    }
  }
  const tokenId = details?.tokenId || token || token_id || token_identifier || '';
  const buildSonicData = async () => {
    const isSwap = operation?.toLowerCase?.()?.includes?.('swap');
    const isLiquidity = operation?.toLowerCase?.()?.includes?.('liquidity');
    let data: any = { token: await getHandledTokenInfo(tokenId), amount: amount };
    if (isSwap) {
      data.swap = {
        from: await getHandledTokenInfo(details?.from),
        to: await getHandledTokenInfo(details?.to),
        amountIn,
        amountOut
      };
    }
    if (isLiquidity) {
      const token0 = await getHandledTokenInfo(details?.token0);
      const token1 = await getHandledTokenInfo(details?.token1);
      const pair = `${token0?.details?.symbol}/${token1?.details?.symbol}`;
      data.liquidity = {
        pair,
        token0: { token: token0, amount: details?.amount0 },
        token1: { token: token1, amount: details?.amount1 }
      }
    }
    return data;
  }
  return recursiveParseBigint({
    hash: transaction.sk,
    timestamp: time,
    type: operation,
    details: {
      ...details,
      amount: parsedAmount,
      canisterId,
      tokenId,
      to: parsePrincipal(details?.to),
      from: parsePrincipal(details?.from),
      ...(canisterId === "3xwpq-ziaaa-aaaah-qcn4a-cai" ? {
        sonicData: await buildSonicData()
      } : {}),
    },
    caller: parsePrincipal(caller) || '',
  });
};

const metadataArrayToObject = (metadata) => metadata.reduce((acum, item) =>
  ({ ...acum, [item.principal_id.toString()]: item }), {});


const getCanistersInfo = async (canisterIds: string[]): Promise<any> => {
  const dabTokensInfo = metadataArrayToObject(await getTokens());
  const dabNFTsInfo = metadataArrayToObject(await getAllNFTS({}));
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
        const fetchedCanisterInfo = await getCanisterInfo(canisterId);
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

export const getCapTransactions = async (
  principalId: string,
  lastEvaluatedKey?: LastEvaluatedKey
): Promise<GetUserTransactionResponse> => {
  let total: number = 0;
  let transactions: InferredTransaction[] = [];
  let LastEvaluatedKey: LastEvaluatedKey | undefined = lastEvaluatedKey;
  try {
    do {
      const options = {
        method: "get" as Method,
        url: `https://kyasshu.fleek.co/cap/user/txns/${principalId}`,
        ...(LastEvaluatedKey ? {
          params: {
            LastEvaluatedKey,
          },
        } : {}),
      };
      const response = await axios(options);
      const canisterIds = uniqueMap<KyashuItem, string>(response.data.Items, item => getTransactionCanister(item.contractId));
      const canistersInfo = await getCanistersInfo(canisterIds);
      const lastTransactions = await Promise.all(response.data.Items.map(async item => formatTransaction(item,canistersInfo)));
      LastEvaluatedKey = response.data.LastEvaluatedKey;
      total += response.data.Count;
      transactions = [...transactions, ...lastTransactions];
    } while (LastEvaluatedKey)
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
