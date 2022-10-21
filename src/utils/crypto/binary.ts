/* eslint-disable prefer-spread */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-bitwise */
import crc32 from 'buffer-crc32';
import CryptoJS from 'crypto-js';

export const byteArrayToWordArray = (
  byteArray: Uint8Array,
  cryptoAdapter = CryptoJS
) => {
  const wordArray = [] as any;
  let i;
  for (i = 0; i < byteArray.length; i += 1) {
    wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i);
  }
  // eslint-disable-next-line
  const result = cryptoAdapter.lib.WordArray.create(
    wordArray,
    byteArray.length
  );
  return result;
};

export const wordToByteArray = (word, length): number[] => {
  const byteArray: number[] = [];
  const xFF = 0xff;
  if (length > 0) byteArray.push(word >>> 24);
  if (length > 1) byteArray.push((word >>> 16) & xFF);
  if (length > 2) byteArray.push((word >>> 8) & xFF);
  if (length > 3) byteArray.push(word & xFF);

  return byteArray;
};

export const wordArrayToByteArray = (wordArray, length) => {
  if (
    wordArray.hasOwnProperty('sigBytes') &&
    wordArray.hasOwnProperty('words')
  ) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  let result: number[] = [];
  let bytes;
  let i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result = [...result, bytes];
    i += 1;
  }
  return [].concat.apply([], result);
};

export const intToHex = (val: number) =>
  val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);

// We generate a CRC32 checksum, and trnasform it into a hexString
export const generateChecksum = (hash: Uint8Array) => {
  const crc = crc32.unsigned(Buffer.from(hash));
  const hex = intToHex(crc);
  return hex.padStart(8, '0');
};

export const lebDecode = pipe => {
  let weight = BigInt(1);
  let value = BigInt(0);
  let byte;
  do {
    if (pipe.length < 1) {
      throw new Error('unexpected end of buffer');
    }
    [byte] = pipe;
    pipe = pipe.slice(1);
    value += BigInt(byte & 0x7f).valueOf() * weight;
    weight *= BigInt(128);
  } while (byte >= 0x80);
  return value;
};
