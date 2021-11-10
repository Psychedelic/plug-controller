import Secp256k1 from 'secp256k1';
import { TextEncoder } from 'text-encoding-shim';
import { Secp256k1PublicKey } from '@dfinity/identity';

const encoder = new TextEncoder('utf-8');

export const sign = (message: string, secretKey: ArrayBuffer): Uint8Array => {
  const encoded = encoder.encode(message);
  const buffer = Buffer.from([
    ...Buffer.alloc(32 - encoded.length).fill(0),
    ...encoded,
  ]);
  const { signature } = Secp256k1.ecdsaSign(buffer, new Uint8Array(secretKey));
  return signature;
};
export const verify = (
  message: string,
  signature: Uint8Array,
  publicKey: Secp256k1PublicKey
): boolean => {
  const encoded = encoder.encode(message);
  const buffer = Buffer.from([
    ...Buffer.alloc(32 - encoded.length).fill(0),
    ...encoded,
  ]);
  return Secp256k1.ecdsaVerify(
    signature,
    buffer,
    new Uint8Array(publicKey.toRaw())
  );
};
