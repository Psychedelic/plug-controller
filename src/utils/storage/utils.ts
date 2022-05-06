import extension from 'extensionizer';
import JsonBigInt from 'json-bigint';
import handler14_5 from './update_handlers/v0.14.5';

import { PlugState } from '../../interfaces/plug_keyring';
import { LEDGER_CANISTER_ID } from '../dfx/constants';
import { TOKENS } from '../../constants/tokens';

export const isEmpty = (obj): boolean => Object.keys(obj).length === 0;

/**
 * Returns an Error if extension.runtime.lastError is present
 * this is a workaround for the non-standard error object that's used
 * @returns {Error|undefined}
 */
export const checkForError = (): Error | undefined => {
  const { lastError } = extension.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message);
};

const VERSION_PATH: Array<string> = ['0.14.1', '0.14.5', '0.16.8'];

const VERSION_HANDLER: { [version: string]: (storage: any) => PlugState } = {
  '0.14.1': (storage: any) => {
    return storage;
  },
  '0.14.5': handler14_5,
  '0.16.8': (storage: any) => {
    return { 
      ...storage, wallets: storage.wallets.map(
      (wallet) => {
        delete wallet.assets.null;
        return ({
          ...wallet,
          assets: { [LEDGER_CANISTER_ID]: { amount: '0', token: TOKENS.ICP }, ...wallet.assets },
        })
      })
    }
  },
};

const compareVersion = (a: string, b: string): number => {
  const arrA = a.split('.');
  const arrB = b.split('.');
  if (arrA.length !== 3 || arrB.length !== 3)
    throw Error('Storage Hande Update: invalid version');
  for (let index = 0; index < 3; index++) {
    const numbA = parseInt(arrA[index]);
    const numbB = parseInt(arrB[index]);
    if (numbA > numbB) return -1;
    else if (numbA < numbB) return 1;
  }
  return 0;
};

const getVersionIndex = (version: string | undefined): number => {
  if (!version) return 0;

  for (let index = 0; index < VERSION_PATH.length; index++) {
    const comparison = compareVersion(version, VERSION_PATH[index]);
    if (comparison === 1) return index;
    if (comparison === 0) return index + 1;
  }

  return VERSION_PATH.length;
};

export const handleStorageUpdate = (
  storageVersion: string | undefined,
  storage: any
): PlugState => {
  const index = getVersionIndex(storageVersion);
  if (index === VERSION_PATH.length) return storage;

  let newStorage = storage;
  VERSION_PATH.slice(index).forEach(version => {
    console.log(`APPLYING STORAGE UPDATE V${version}...`);
    newStorage = VERSION_HANDLER[version](storage);
  });
  return newStorage;
};
