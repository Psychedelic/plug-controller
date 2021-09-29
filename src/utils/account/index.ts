import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { Principal } from '@dfinity/principal';

import { ERRORS } from '../../errors';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';
import { AccountCredentials } from '../../interfaces/account';
import { ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO } from './constants';
import {
  byteArrayToWordArray,
  generateChecksum,
  wordArrayToByteArray,
} from '../crypto/binary';
import { createSecp256K1KeyPair } from '../crypto/keys';

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
  sha.update(byteArrayToWordArray(principal.toUint8Array()));
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
  const keyPair = createSecp256K1KeyPair(mnemonic, subAccount || 0);
  // Identity has boths keys via getKeyPair and PID via getPrincipal
  const identity = Secp256k1KeyIdentity.fromKeyPair(
    keyPair.publicKey.toRaw(),
    keyPair.secretKey
  );
  const accountId = getAccountId(identity.getPrincipal());
  return {
    mnemonic,
    identity,
    accountId,
  };
};

export const createAccount = (entropy?: Buffer): AccountCredentials => {
  const mnemonic = entropy
    ? bip39.entropyToMnemonic(entropy)
    : bip39.generateMnemonic();
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
