import extension from 'extensionizer';
import JsonBigInt from 'json-bigint';

import { PlugState } from '../../PlugKeyRing'

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

const VERSION_PATH: Array<string> = ['0.14.1']

const VERSION_HANDLER: { [version: string]: (storage: any) => PlugState } = {
  '0.14.1': (storage: any) => {
    console.log('This is storage of version 0.4.5:', JsonBigInt.stringify(storage));
    return storage;
  }
};

const compareVersion = (a: string, b: string): number => {
  const arrA = a.split('.');
  const arrB = b.split('.');
  if (arrA.length !== 3 || arrB.length !== 3)
    throw Error('Storage Hande Update: invalid version');
  for (let index = 0; index < 3; index++) {
    const numbA = parseInt(arrA[index])
    const numbB = parseInt(arrB[index])
    if (numbA > numbB)
      return -1;
    else if (numbA < numbB)
      return 1;
  }
  return 0;
}

const getVersionIndex = (version: string | undefined): number => {
  if (!version)
    return 0;

  for (let index = 0; index++ < VERSION_PATH.length; index++) {
    const comparison = compareVersion(version, VERSION_PATH[index])
    if (comparison === 1)
      return index;
    if (comparison === 0)
      return index++;
  }

  return VERSION_PATH.length;
}


export const handleStorageUpdate = (storageVersion: string | undefined, storage: any): PlugState => {
  const index = getVersionIndex(storageVersion);
  console.log('handleStorageUpdate ', storageVersion, index)
  if (index === VERSION_PATH.length)
    return storage;

  let newStorage = storage;
  console.log('VERSION_PATH', VERSION_PATH.slice(index));
  VERSION_PATH.slice(index).forEach((version) => {
    console.log('handleStorageUpdate APPLY', version)
    newStorage = VERSION_HANDLER[version](storage);
  });

  return newStorage;
}
