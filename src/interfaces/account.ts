import Secp256k1KeyIdentity from '../utils/crypto/secpk256k1/identity';

export interface AccountCredentials {
  mnemonic: string;
  identity: Secp256k1KeyIdentity;
  accountId: string;
}

export interface ConnectedApp {
  name: string;
  icon: string;
  url: string;
  whitelist: Array<string>;
  status: string;
}
