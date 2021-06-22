import { Ed25519KeyIdentity } from '@dfinity/identity';

export interface AccountCredentials {
  mnemonic: string;
  identity: Ed25519KeyIdentity;
  accountId: string;
}
