import { BinaryBlob } from '@dfinity/candid';
import Secp256k1 from 'secp256k1';
import Secp256k1PublicKey from '../crypto/secpk256k1/publicKey';

const encoder = new TextEncoder();

export const sign = (message: string, secretKey: BinaryBlob): Uint8Array => {
  const buffer = Buffer.alloc(32).fill(0);
  encoder.encodeInto(message, buffer);
  const { signature } = Secp256k1.ecdsaSign(buffer, secretKey);
  return signature;
};
export const verify = (
  message: string,
  signature: Uint8Array,
  publicKey: Secp256k1PublicKey
): boolean => {
  const buffer = Buffer.alloc(32).fill(0);
  encoder.encodeInto(message, buffer);
  return Secp256k1.ecdsaVerify(signature, buffer, publicKey.toRaw());
};
