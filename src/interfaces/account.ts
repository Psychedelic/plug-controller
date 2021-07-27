import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';

export interface AccountCredentials {
  mnemonic: string;
  identity: Secp256k1KeyIdentity;
  accountId: string;
}
