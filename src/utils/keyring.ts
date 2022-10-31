import { JSONWallet } from "../interfaces/plug_wallet";
import { createWallet } from "../PlugWallet";
import { IdentityFactory } from "./identity/identityFactory";

export const instanceWallets = async (wallets: { [key: string]: JSONWallet}, fetch, networkModule) => {
  const walletsArray = await Promise.all(
    Object.values(wallets)
    .map(async wallet => ({ id: wallet.walletId, identity: await IdentityFactory.createIdentity(wallet.type, wallet.keyPair), wallet }))
  );
  return walletsArray.reduce(
    (walletsAccum, walletObj) => ({
      ...walletsAccum,
      [walletObj.id]: createWallet({
        ...walletObj.wallet,
        fetch: fetch,
        network: networkModule.network,
        identity: walletObj.identity
      })
    }),
    {}
  );
};

