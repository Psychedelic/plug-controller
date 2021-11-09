/* eslint-disable camelcase */
import crossFetch from 'cross-fetch';

import { IC_URL_HOST, PLUG_PROXY_HOST } from './constants';

let useICUrl = false;

/* eslint-disable no-param-reassign */
const wrappedFetchInternal = (
  fetch,
  resolve,
  reject,
  resource,
  ...initArgs
): void => {
  if (!resource.includes(PLUG_PROXY_HOST)) {
    fetch(resource, ...initArgs)
      .then(resolve)
      .catch(reject);
    return;
  }
  if (useICUrl) {
    resource = new URL(resource);
    resource.host = IC_URL_HOST;
  }
  fetch(resource, ...initArgs)
    .then(r => {
      if (!useICUrl && r.status === 502) {
        useICUrl = true;
        wrappedFetchInternal(resolve, reject, resource, initArgs);
        return;
      }
      resolve(r);
    })
    .catch(e => {
      reject(e);
    });
};

export const wrappedFetch = (fetch = crossFetch) => (
  ...args: Parameters<typeof crossFetch>
): Promise<Response> => {
  let reject;
  let resolve;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  wrappedFetchInternal(fetch, resolve, reject, ...args);

  return promise as Promise<Response>;
};

export default { wrappedFetch };
