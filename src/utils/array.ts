/* eslint-disable import/prefer-default-export */
export const uniqueByObjKey = (arr: Array<any>, key: string): Array<any> => [
  ...new Map(arr.map(item => [item[key], item])).values(),
];

export const fromHexToUint8Array = (hexString: string): Uint8Array =>
  new Uint8Array(
    hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );

export const fromUint8ArrayToHex = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
