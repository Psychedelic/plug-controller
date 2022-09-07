import { GenericSignIdentity } from './genericSignIdentity';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';
import { Types } from '../account/constants';
import { ERRORS } from '../../errors';

export class IdentityFactory {
    public static createIdentity(type: string, secretKey: string): GenericSignIdentity {
        switch (type) {
            case Types.pem256k1:
            case Types.mnemonic:
                return Secp256k1KeyIdentity.fromJSON(secretKey);
            default:
                throw new Error(ERRORS.INVALID_TYPE_ERROR);
        }
    }

}
