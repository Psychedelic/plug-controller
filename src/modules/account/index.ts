const { derivePath }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const CryptoJS = require('crypto-js');
const { Ed25519KeyIdentity } = require("@dfinity/identity");
const crc32 = require('buffer-crc32');

import { ERRORS } from "../../errors";
import { AccountCredentials } from "../../interfaces/account";
import { DERIVATION_PATH, ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO, SELF_AUTH_TYPE  } from "./constants";
import { Principal } from '@dfinity/agent';
import { intToHex, wordArrayToByteArray } from "../../utils/byte";

/// While this is backed by an array of length 28, it's canonical representation
/// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
/// hash of the following 56 characters of hex. Both, upper and lower case
/// characters are valid in the input string and can even be mixed.
///
/// When it is encoded or decoded it will always be as a string to make it
/// easier to use from DFX.
/// [ic/rs/rosetta-api/ledger_canister/src/account_identifier.rs]

// We generate a CRC32 checksum, and trnasform it into a hexString
const generateChecksum = (hash: Uint8Array) => {
    const crc = crc32.signed(Buffer.from(hash));
    return intToHex(crc);
}

const createAccountId = (principalId: Principal, subAccount?: number) => {
    const sha = CryptoJS.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPERATOR);
    sha.update(principalId.toHex());
    sha.update(subAccount?.toString() || SUB_ACCOUNT_ZERO);
    const hash = sha.finalize();
    const byteArray = wordArrayToByteArray(hash, 28);
    const checksum = generateChecksum(byteArray);
    return checksum + hash.toString();
}

const deriveSeed = (mnemonic: string, index?: number) => {
    const hexSeed = bip39.mnemonicToSeedSync(mnemonic);
    return derivePath(DERIVATION_PATH, hexSeed.toString('hex'), index);
}

const getAccountCredentials = (mnemonic: string, subAccount?: number): AccountCredentials => {
    const { key } = deriveSeed(mnemonic, subAccount);
    // Identity has boths keys via getKeyPair and PID via getPrincipal
    const identity = Ed25519KeyIdentity.generate(key);
    const accountId = createAccountId(identity.getPrincipal(), subAccount);
    return { 
        mnemonic,
        identity,
        accountId
    }
}

export const createAccount = () : AccountCredentials => {
    const mnemonic = bip39.generateMnemonic();
    return getAccountCredentials(mnemonic);
}

export const createAccountFromMnemonic = (mnemonic: string, accountId: number) : AccountCredentials => {
    if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
        throw new Error(ERRORS.INVALID_MNEMONIC);
    }
    if (typeof accountId !== 'number' || accountId < 0) {
        throw new Error(ERRORS.INVALID_ACC_ID);
    }
    return getAccountCredentials(mnemonic, accountId);
}