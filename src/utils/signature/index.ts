import { blobToHex } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import ellipticcurve from 'starkbank-ecdsa';

import { PublicKey } from '../crypto/secpk256k1/publicKey';

const { Ecdsa, PrivateKey } = ellipticcurve;

export const sign = (message: string, secretKey: BinaryBlob): ArrayBuffer => {
  return Ecdsa.sign(message, PrivateKey.fromString(blobToHex(secretKey)));
};
export const verify = (
  message: string,
  signature: ArrayBuffer,
  publicKey: PublicKey
): boolean => {
  return Ecdsa.verify(message, signature, publicKey);
};
