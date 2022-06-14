import { TokenRegistry } from "@psychedelic/dab-js";
import { parsePrincipal } from "../../../object";

const SONIC_SWAP_CANISTER_ID = "3xwpq-ziaaa-aaaah-qcn4a-cai";

const getHandledTokenInfo = async (principal, canistersInfo) => {
  if (!principal) return;
  const canisterId = parsePrincipal(principal);
  if (canistersInfo[canisterId]?.tokenRegistryInfo) return canistersInfo[canisterId]?.tokenRegistryInfo;
  else {
    const registry = new TokenRegistry();
    const data = await registry.get(canisterId);
    return data;
  }
}

export const buildSonicData = async ({ canisterId, details, operation, canistersInfo, tokenId }) => {
  if (canisterId !== SONIC_SWAP_CANISTER_ID) return;
  const { amount, amountIn, amountOut } = details || {};
  const isSwap = operation?.toLowerCase?.()?.includes?.('swap');
  const isLiquidity = operation?.toLowerCase?.()?.includes?.('liquidity');

  let data: any = { token: await getHandledTokenInfo(tokenId, canistersInfo), amount };
  if (isSwap) {
    data.swap = {
      from: await getHandledTokenInfo(details?.from, canistersInfo),
      to: await getHandledTokenInfo(details?.to, canistersInfo),
      amountIn,
      amountOut
    };
    delete data.amount;
  }
  if (isLiquidity) {
    const token0 = await getHandledTokenInfo(details?.token0, canistersInfo);
    const token1 = await getHandledTokenInfo(details?.token1, canistersInfo);
    const pair = `${token0?.details?.symbol}/${token1?.details?.symbol}`;
    data.liquidity = {
      pair,
      token0: { token: token0, amount: details?.amount0 },
      token1: { token: token1, amount: details?.amount1 }
    }
    delete data.amount;
  }
  return data;
}