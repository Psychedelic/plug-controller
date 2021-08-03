import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';

export interface AccountCredentials {
  mnemonic?: string;
  identity: Secp256k1KeyIdentity;
  accountId: string;
  pem?: string;
}
export interface AccountCredentialsFromMnemonic {
  mnemonic: string;
  identity: Secp256k1KeyIdentity;
  accountId: string;
}

export interface AccountCredentialsFromPem {
  pem: string;
  identity: Secp256k1KeyIdentity;
  accountId: string;
}
