import { createAccountFromMnemonic } from '../../../utils/account';
import { Types } from '../../../utils/account/constants';
import Secp256k1KeyIdentity from '../../identity/secpk256k1/identity';

const getKeyPair = (identity: Secp256k1KeyIdentity) => {
    const jsonIdentity = identity.toJSON();
    return typeof jsonIdentity === 'string' 
        ? jsonIdentity
        : JSON.stringify(jsonIdentity);
}

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
                    keyPair: getKeyPair(identity),
                })
            })
    }
};
