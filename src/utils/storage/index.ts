import extension from 'extensionizer';
import { isEmpty, checkForError } from './utils';

/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

/**
 * A wrapper around the extension's storage local API
 */
class ExtensionStore {
  isSupported: boolean;

  constructor() {
    this.isSupported = Boolean(extension?.storage?.local);
    if (!this.isSupported) {
      console.log('Storage not supported in this browser'); // eslint-disable-line
    }
  }

  /**
   * Returns all of the keys currently saved
   * @returns {Promise<*>}
   */
  public async get(): Promise<string | undefined | unknown> {
    if (!this.isSupported) {
      return undefined;
    }
    const result = await this._get();
    // extension?.storage.local always returns an obj
    // if the object is empty, treat it as undefined
    if (isEmpty(result)) {
      return undefined;
    }
    return result;
  }

  /**
   * Sets the key in local state
   * @param {Object} state - The state to set
   * @returns {Promise<void>}
   */
  public async set(state): Promise<void> {
    return this._set(state);
  }

  /**
   * Returns all of the keys currently saved
   * @private
   * @returns {Object} the key-value map from local storage
   */
  private _get(): Promise<unknown> {
    const { local } = extension?.storage;
    return new Promise((resolve, reject) => {
      local.get(null, (/** @type {any} */ result) => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Sets the key in local state
   * @param {Object} obj - The key to set
   * @returns {Promise<void>}
   * @private
   */
  private _set(obj): Promise<void> {
    const { local } = extension?.storage;
    return new Promise<void>((resolve, reject) => {
      local.set(obj, () => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async clear(): Promise<void> {
    const { local } = extension?.storage;
    return new Promise<void>((resolve, reject) => {
      local.clear(() => {
        const err = checkForError();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default ExtensionStore;
