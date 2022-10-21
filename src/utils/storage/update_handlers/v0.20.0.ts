import { createAccountFromMnemonic } from '../../account';
import { Types } from '../../account/constants';

export default (storage: any) => {
  const { mnemonic } = storage;
  return {
    ...storage,
    wallets: storage.wallets.map(wallet => {
      const { identity } = createAccountFromMnemonic(
        mnemonic,
        wallet.walletNumber
      );
      return {
        ...wallet,
        type: Types.mnemonic,
        keyPair: identity.toJSON(),
      };
    }),
  };
};
