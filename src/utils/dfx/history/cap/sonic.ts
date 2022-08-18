import { TokenRegistry } from '@psychedelic/dab-js';
import { parsePrincipal } from '../../../object';

export const SONIC_SWAP_CANISTER_ID = '3xwpq-ziaaa-aaaah-qcn4a-cai';

const getHandledTokenInfo = async (principal, canistersInfo) => {
  if (!principal) return;
  const canisterId = parsePrincipal(principal);
  if (canistersInfo[canisterId]?.tokenRegistryInfo)
    return canistersInfo[canisterId]?.tokenRegistryInfo;
  else {
    const registry = new TokenRegistry();
    const data = await registry.get(canisterId);
    return data;
  }
};

export const buildSonicData = async ({
  canisterId,
  details,
  operation,
  canistersInfo,
  tokenId,
}) => {
  console.log('operation ->', operation);
  console.log('details ->', details);
  console.log('canistersInfo ->', canistersInfo);
  if (canisterId !== SONIC_SWAP_CANISTER_ID) return;
  const { amount, amountIn, amountOut } = details || {};
  const isSwap = operation?.toLowerCase?.()?.includes?.('swap');
  const isLiquidity = operation?.toLowerCase?.()?.includes?.('liquidity');

  let data: any = {
    token: canistersInfo[tokenId]?.tokenRegistryInfo,
    amount,
  };
  if (isSwap) {
    data.swap = {
      from: canistersInfo[details?.from]?.tokenRegistryInfo || {
        name: canistersInfo[details?.from]?.name,
        thumbnail: canistersInfo[details?.from]?.logo_url,
        logo: canistersInfo[details?.from]?.logo_url,
        description: canistersInfo[details?.from]?.description,
        symbol: canistersInfo[details?.from]?.name.split(" ")[0],
      },
      to: canistersInfo[details?.to]?.tokenRegistryInfo || {
        name: canistersInfo[details?.to]?.name,
        thumbnail: canistersInfo[details?.to]?.logo_url,
        logo: canistersInfo[details?.to]?.logo_url,
        description: canistersInfo[details?.to]?.description,
        symbol: canistersInfo[details?.to]?.name.split(" ")[0],
      },
      amountIn,
      amountOut,
    };
    delete data.amount;
  }
  if (isLiquidity) {
    const token0 = canistersInfo[details?.token0]?.tokenRegistryInfo;
    const token1 = canistersInfo[details?.token1]?.tokenRegistryInfo;
    const pair = `${token0?.details?.symbol}/${token1?.details?.symbol}`;
    data.liquidity = {
      pair,
      token0: { token: token0, amount: details?.amount0 },
      token1: { token: token1, amount: details?.amount1 },
    };
    delete data.amount;
  }
  return data;
};
