import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { Principal, blobFromHex } from '@dfinity/agent';

import { ERRORS } from '../../errors';

import {
  AccountCredentials,
  AccountCredentialsFromMnemonic,
  AccountCredentialsFromPem,
  AccountCredentialsFromPrivateKey,
} from '../../interfaces/account';
import { ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO } from './constants';
import {
  byteArrayToWordArray,
  generateChecksum,
  wordArrayToByteArray,
} from '../crypto/binary';
import { createSecp256K1KeyPair } from '../crypto/keys';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';

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

const getAccountCredentialsMnemonic = (
  mnemonic: string,
  subAccount?: number
): AccountCredentialsFromMnemonic => {
  const keyPair = createSecp256K1KeyPair(mnemonic, subAccount || 0);
  // Identity has boths keys via getKeyPair and PID via getPrincipal
  const identity = Secp256k1KeyIdentity.fromKeyPair(
    keyPair.publicKey.toRaw(),
    keyPair.secretKey
  );
  const accountId = getAccountId(identity.getPrincipal(), subAccount);
  return {
    mnemonic,
    identity,
    accountId,
  };
};

const getAccountCredentialsFromPem = (
  pem: string,
  subAccount?: number
): AccountCredentialsFromPem => {
  // Identity has boths keys via getKeyPair and PID via getPrincipal
  const identity = Secp256k1KeyIdentity.fromPem(pem);
  const accountId = getAccountId(identity.getPrincipal(), subAccount);
  return {
    pem,
    identity,
    accountId,
  };
};

const getAccountCredentialsFromPrivateKey = (
  privateKey: string,
  subAccount?: number
): AccountCredentialsFromPrivateKey => {
  // Identity has boths keys via getKeyPair and PID via getPrincipal
  const identity = Secp256k1KeyIdentity.fromSecretKey(blobFromHex(privateKey));
  const accountId = getAccountId(identity.getPrincipal(), subAccount);
  return {
    privateKey,
    identity,
    accountId,
  };
};

export const createAccount = (): AccountCredentialsFromMnemonic => {
  const mnemonic = bip39.generateMnemonic();
  return getAccountCredentialsMnemonic(mnemonic, 0);
};

export const createAccountFromPem = (
  pem: string,
  accountId: number
): AccountCredentials => {
  if (!pem.length) throw new Error(ERRORS.INVALID_PEM);
  if (typeof accountId !== 'number' || accountId < 0) {
    throw new Error(ERRORS.INVALID_ACC_ID);
  }
  return getAccountCredentialsFromPem(pem, accountId);
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
  return getAccountCredentialsMnemonic(mnemonic, accountId);
};

export const createAccountFromPrivateKey = (
  privateKey: string,
  accountId: number
): AccountCredentials => {
  if (!privateKey || !privateKey.length) {
    throw new Error(ERRORS.INVALID_MNEMONIC);
  }
  if (typeof accountId !== 'number' || accountId < 0) {
    throw new Error(ERRORS.INVALID_ACC_ID);
  }
  return getAccountCredentialsFromPrivateKey(privateKey, accountId);
};

export const verifyMnemonic = (
  mnemonic: string,
  privateKey: string,
  accountId: number
): boolean => {
  try {
    const { identity } = getAccountCredentialsMnemonic(mnemonic, accountId);
    return identity.getKeyPair().secretKey.toString('hex') === privateKey;
  } catch (e) {
    return false;
  }
};
