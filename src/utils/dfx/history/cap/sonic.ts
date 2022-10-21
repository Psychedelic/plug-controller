/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
export const SONIC_SWAP_CANISTER_ID = '3xwpq-ziaaa-aaaah-qcn4a-cai';

export const buildSonicData = async ({
  canisterId,
  details,
  operation,
  canistersInfo,
  tokenId,
}) => {
  if (canisterId !== SONIC_SWAP_CANISTER_ID) return;
  const { amount, amountIn, amountOut } = details || {};
  const isSwap = operation?.toLowerCase?.()?.includes?.('swap');
  const isLiquidity = operation?.toLowerCase?.()?.includes?.('liquidity');

  const data: any = {
    token: canistersInfo[tokenId]?.tokenRegistryInfo,
    amount,
  };

  const formatSwapData = (swapData: any) =>
    swapData?.tokenRegistryInfo || {
      name: swapData?.name,
      thumbnail: swapData?.logo_url,
      logo: swapData?.logo_url,
      description: swapData?.description,
    };

  const from = formatSwapData(canistersInfo[details?.from]);
  const to = formatSwapData(canistersInfo[details?.to]);

  if (isSwap) {
    data.swap = {
      from,
      to,
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
