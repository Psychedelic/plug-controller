import { Secp256k1KeyIdentity } from '@dfinity/identity';

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
}
