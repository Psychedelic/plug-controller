/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
import { Secp256k1KeyIdentity } from '@dfinity/identity';

const PEM_BEGIN = '-----BEGIN PRIVATE KEY-----';

const PEM_END = '-----END PRIVATE KEY-----';

const PRIV_KEY_INIT =
  '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';

const KEY_SEPARATOR = 'a144034200';

export const getPem = (identity: Secp256k1KeyIdentity): string => {
  const { secretKey, publicKey } = identity.getKeyPair();
  const rawPrivateKey = Buffer.from(secretKey).toString('hex');
  const rawPublicKey = Buffer.from(publicKey).toString('hex');

  return `${PEM_BEGIN}\n${Buffer.from(
    `${PRIV_KEY_INIT}${rawPrivateKey}${KEY_SEPARATOR}${rawPublicKey}`,
    'hex'
  ).toString('base64')}\n${PEM_END}`;
};
