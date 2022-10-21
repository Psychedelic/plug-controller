/* eslint-disable no-undef */
/* eslint-disable camelcase */
import crossFetch from 'cross-fetch';

import { IC_URL_HOST } from './constants';

/* eslint-disable no-param-reassign */
const wrappedFetchInternal = (
  fetch,
  resolve,
  reject,
  resource,
  ...initArgs
): void => {
  fetch(resource, ...initArgs)
    .then(response => {
      if (!response.success && !response.ok) {
        const fallbackResource = new URL(resource);
        fallbackResource.host = IC_URL_HOST;
        fetch(fallbackResource, ...initArgs)
          .then(resolve)
          .catch(reject);
      } else {
        resolve(response);
      }
    })
    .catch(reject);
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
