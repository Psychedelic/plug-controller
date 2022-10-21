/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

import extension from 'extensionizer';

import handler14_5 from './update_handlers/v0.14.5';
import handler16_8 from './update_handlers/v0.16.8';
import handler19_3 from './update_handlers/v0.19.3';
import handler20_0 from './update_handlers/v0.20.0';
import handler21_0 from './update_handlers/v0.21.0';

import { PlugStateStorage } from '../../interfaces/plug_keyring';
import { NetworkModuleParams } from '../../PlugKeyRing/modules/NetworkModule';

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

const VERSION_PATH: Array<string> = [
  '0.14.1',
  '0.14.5',
  '0.16.8',
  '0.19.3',
  '0.20.0',
  '0.21.0',
];

const VERSION_HANDLER: {
  [version: string]: (storage: any) => PlugStateStorage;
} = {
  '0.14.1': (storage: any) => {
    return storage;
  },
  '0.14.5': handler14_5,
  '0.16.8': handler16_8,
  '0.19.3': handler19_3,
  '0.20.0': handler20_0,
  '0.21.0': handler21_0,
};

const compareVersion = (a: string, b: string): number => {
  const arrA = a.split('.');
  const arrB = b.split('.');
  if (arrA.length !== 3 || arrB.length !== 3)
    throw Error('Storage Hande Update: invalid version');
  for (let index = 0; index < 3; index += 1) {
    const numbA = parseInt(arrA[index], 10);
    const numbB = parseInt(arrB[index], 10);
    if (numbA > numbB) return -1;
    if (numbA < numbB) return 1;
  }
  return 0;
};

const getVersionIndex = (version: string | undefined): number => {
  if (!version) return 0;

  for (let index = 0; index < VERSION_PATH.length; index += 1) {
    const comparison = compareVersion(version, VERSION_PATH[index]);
    if (comparison === 1) return index;
    if (comparison === 0) return index + 1;
  }

  return VERSION_PATH.length;
};

export const handleStorageUpdate = (
  storageVersion: string | undefined,
  storage: any
): PlugStateStorage & {
  mnemonic: string;
  networkModule?: NetworkModuleParams;
} => {
  const index = getVersionIndex(storageVersion);
  if (index === VERSION_PATH.length) return storage;

  let newStorage = storage;
  VERSION_PATH.slice(index).forEach(version => {
    console.log(`APPLYING STORAGE UPDATE V${version}...`);
    newStorage = VERSION_HANDLER[version](newStorage);
  });
  return newStorage;
};
