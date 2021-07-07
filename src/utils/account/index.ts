import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Principal } from '@dfinity/agent';
import { blobFromUint8Array } from '@dfinity/candid';

import { ERRORS } from '../../errors';

import { AccountCredentials } from '../../interfaces/account';
import { ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO } from './constants';
import { createLedgerActor, createAgent } from '../dfx';
import {
  byteArrayToWordArray,
  generateChecksum,
  wordArrayToByteArray,
} from '../crypto';
import { createKeyPair } from '../crypto/hdKeyManager';

interface DerivedKey {
  key: Buffer;
  chainCode: Buffer;
}

/*
    Used dfinity/keysmith/account/account.go as a base for the ID generation
*/
export const getAccountId = (
  principal: Principal,
  subAccount?: number
): string => {
  const sha = CryptoJS.algo.SHA224.create();
  sha.update(ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
  sha.update(byteArrayToWordArray(Uint8Array.from(principal.toBlob())));
  const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
  if (subAccount) {
    subBuffer.writeUInt32BE(subAccount);
  }
  sha.update(byteArrayToWordArray(subBuffer));
  const hash = sha.finalize();

  /// While this is backed by an array of length 28, it's canonical representation
  /// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
  /// hash of the following 56 characters of hex. Both, upper and lower case
  /// characters are valid in the input string and can even be mixed.
  /// [ic/rs/rosetta-api/ledger_canister/src/account_identifier.rs]
  const byteArray = wordArrayToByteArray(hash, 28);
  const checksum = generateChecksum(byteArray);
  const val = checksum + hash.toString();

  return val;
};

const getAccountCredentials = (
  mnemonic: string,
  subAccount?: number
): AccountCredentials => {
  const keyPair = createKeyPair(mnemonic, subAccount || 0);
  // Identity has boths keys via getKeyPair and PID via getPrincipal
  const identity = Ed25519KeyIdentity.fromKeyPair(
    blobFromUint8Array(keyPair.publicKey),
    blobFromUint8Array(keyPair.secretKey)
  );
  const accountId = getAccountId(identity.getPrincipal(), subAccount);
  return {
    mnemonic,
    identity,
    accountId,
  };
};

export const createAccount = (): AccountCredentials => {
  const mnemonic = bip39.generateMnemonic();
  return getAccountCredentials(mnemonic, 0);
};

export const createAccountFromMnemonic = (
  mnemonic: string,
  accountId: number
): AccountCredentials => {
  if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
    throw new Error(ERRORS.INVALID_MNEMONIC);
  }
  if (typeof accountId !== 'number' || accountId < 0) {
    throw new Error(ERRORS.INVALID_ACC_ID);
  }
  return getAccountCredentials(mnemonic, accountId);
};

// Queries first 10 accounts for the provided key
export const queryAccounts = async (
  secretKey: Uint8Array
): Promise<{ [key: string]: { accountId: string; balance: number } }> => {
  const agent = await createAgent({ secretKey });
  const ledgerActor = await createLedgerActor(agent);
  const identity = Ed25519KeyIdentity.fromSecretKey(secretKey);
  const balances = {};
  for (let subAccount = 0; subAccount < 10; subAccount += 1) {
    const account = getAccountId(identity.getPrincipal(), subAccount);
    ledgerActor.account_balance_dfx({ account }).then(res => {
      console.log('account balanace', res);
      balances[subAccount] = { accountId: account, balance: res.e8s };
    });
  }
  return balances;
};
