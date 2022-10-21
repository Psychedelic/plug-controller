/* eslint-disable no-undef */
import { DEFAULT_MAINNET_TOKENS } from '../../../constants/tokens';
import { TokenBalance } from '../../../interfaces/token';
import { Mainnet } from '../../../PlugKeyRing/modules/NetworkModule/Network';

export default (storage: any) => {
  const defaultTokenIds = DEFAULT_MAINNET_TOKENS.map(t => t.canisterId);
  const { wallets } = storage;

  // For each wallet, get its tokens and add the wallet id to the list of registered by
  const nestedTokens = wallets?.map(wallet =>
    (Object.values(wallet?.assets) || []).map((asset: TokenBalance) => ({
      ...(asset?.token || {}),
      registeredBy: [wallet.walletNumber],
      logo: asset?.token?.logo || (asset?.token as any)?.image,
    }))
  );
  const tokens = nestedTokens?.flat?.() || [];
  // Remove default tokens and merge duplicates, concatting their registeredBy
  const registeredTokens = tokens.reduce((acum, token) => {
    // Remove default tokens
    if (defaultTokenIds.includes(token.canisterId)) {
      return acum;
    }

    // If we already had this token, only update the registeredby array
    const registeredTokenIndex = acum.findIndex(
      t => t.canisterId === token.canisterId
    );
    if (registeredTokenIndex > -1) {
      const registeredToken = acum[registeredTokenIndex];
      const updatedToken = {
        ...registeredToken,
        registeredBy: [...registeredToken.registeredBy, ...token.registeredBy],
      };
      const copy = [...acum];
      copy[registeredTokenIndex] = updatedToken;
      return copy;
    }
    // Else just add the token (first time we find it)
    return [...acum, token];
  }, [] as any);

  const newStorage = {
    ...storage,
    networkModule: {
      ...(storage.networkModule || {}),
      networks: {
        ...(storage?.networkModule?.networks || {}),
        mainnet: new Mainnet({ registeredTokens }, fetch).toJSON(),
      },
      networkId: storage?.networkModule?.networkId || 'mainnet',
    },
  };
  return newStorage;
};
