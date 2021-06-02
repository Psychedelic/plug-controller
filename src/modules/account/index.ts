const { derivePath }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const CryptoJS = require('crypto-js');
const { Ed25519KeyIdentity } = require("@dfinity/identity");

import { ERRORS } from "../../errors";
import { AccountCredentials } from "../../interfaces/account";
import { DERIVATION_PATH, ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO, SELF_AUTH_TYPE  } from "./constants";
import { Principal } from '@dfinity/agent';

const deriveSeed = (mnemonic: string, index?: number) => {
    const hexSeed = bip39.mnemonicToSeedSync(mnemonic);
    return derivePath(DERIVATION_PATH, hexSeed.toString('hex'), index);
}

// TODO: Missing tests
const createAccountId = (principalId: Principal, subAccount?: number) => {
    const sha = CryptoJS.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPERATOR);
    sha.update(principalId.toString());
    sha.update(subAccount?.toString() || SUB_ACCOUNT_ZERO);
    const hash = sha.finalize();
    return hash.toString();
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
    if (!accountId || typeof accountId !== 'number' || accountId < 0) {
        throw new Error(ERRORS.INVALID_ACC_ID);
    }
    return getAccountCredentials(mnemonic, accountId);
}