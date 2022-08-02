import { DEFAULT_MAINNET_TOKENS } from '../../../constants/tokens';
import { JSONWallet } from '../../../interfaces/plug_wallet';
import { Mainnet, RegisteredToken } from '../../../PlugKeyRing/modules/NetworkModule/Network';

export default (storage: any) => {
  const defaultTokenIds = DEFAULT_MAINNET_TOKENS.map((t) => t.canisterId);
  const wallets: JSONWallet[] = storage.wallets;

  // For each wallet, get its tokens and add the wallet id to the list of registered by
  const tokens = wallets.map((wallet) => Object.values(wallet.assets).map(
    (asset) => ({
      ...asset.token,
      registeredBy: [wallet.walletNumber],
      logo: asset?.token?.logo || (asset?.token as any)?.image,
    }),
    )).flat();
  
  // Remove default tokens and merge duplicates, concatting their registeredBy
  const registeredTokens = tokens.reduce((acum, token) => {

    // Remove default tokens
    if (defaultTokenIds.includes(token.canisterId)) {
      return acum;
    }

    // If we already had this token, only update the registeredby array
    const registeredToken = acum.find((t) => t.canisterId === token.canisterId);
    if (registeredToken) {
      const updatedToken = { ...registeredToken, registeredBy: [...registeredToken.registeredBy, ...token.registeredBy] };
      return acum.map((t) => t.canisterId === token.canisterId ? updatedToken : t);
    }
    // Else just add the token (first time we find it)
    return [...acum, token];
  }, [] as RegisteredToken[]);

  const newStorage = { 
    ...storage,
    networkModule: {
      ...(storage.networkModule || {}),
        networks: {
          ...(storage?.networkModule?.networks || {}),
          mainnet: (new Mainnet({ registeredTokens }, fetch)).toJSON()
        },
        networkId: storage?.networkModule?.networkId || 'mainnet',
      },
  };
  return newStorage;
};
