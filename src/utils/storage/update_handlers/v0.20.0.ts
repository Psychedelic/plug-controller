import { createAccountFromMnemonic } from '../../../utils/account';
import { Types } from '../../../utils/account/constants';


export default (storage: any) => {
    const mnemonic = storage.mnemonic;
    return {
        ...storage, wallets: storage.wallets.map(
            (wallet) => {
                const { identity } = createAccountFromMnemonic(
                    mnemonic,
                    wallet.walletNumber
                );
                return ({
                    ...wallet,
                    type: Types.mnemonic,
                    keyPair: identity.toJSON(),
                })
            })
    }
};
