import { GenericSignIdentity } from './genericSignIdentity';
import Secp256k1KeyIdentity from './secpk256k1/identity';
import Ed25519KeyIdentity from './ed25519/ed25519Identity';
import { IDENTITY_TYPES } from '../account/constants';
import { ERRORS } from '../../errors';
import LedgerIdentity from './ledger';

export class IdentityFactory {
  public static async createIdentity(
    type: string,
    secretKey: string
  ): Promise<GenericSignIdentity> {
    switch (type) {
      case IDENTITY_TYPES.pem256k1:
      case IDENTITY_TYPES.mnemonic:
        return Secp256k1KeyIdentity.fromJSON(secretKey);
      case IDENTITY_TYPES.pem25519:
        return Ed25519KeyIdentity.fromJSON(secretKey);
      case IDENTITY_TYPES.ledger:
        return LedgerIdentity.fromJSON(secretKey);
      default:
        throw new Error(ERRORS.INVALID_TYPE_ERROR);
    }
  }
}
