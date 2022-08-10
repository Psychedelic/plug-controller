import { Principal } from '@dfinity/principal';
import JsonBigInt from 'json-bigint';

// eslint-disable-next-line
export const recursiveParseBigint = obj => JsonBigInt.parse(JsonBigInt.stringify(obj));

export const parsePrincipal = pidObj =>
pidObj?._isPrincipal
  ? Principal.fromUint8Array(
      new Uint8Array(Object.values((pidObj as any)._arr))
    ).toString()
  : pidObj;
