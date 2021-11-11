/* eslint-disable import/prefer-default-export */
export const uniqueByObjKey = (arr: Array<any>, key: string): Array<any> => [
  ...new Map(arr.map(item => [item[key], item])).values(),
];

/*
 * Return an array buffer from its hexadecimal representation.
 * @param hexString The hexadecimal string.
 */
export function fromHexToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array(
    (hexString.match(/.{1,2}/g) ?? []).map(byte => parseInt(byte, 16))
  );
}

/**
 * Returns an hexadecimal representation of an array buffer.
 * @param bytes The array buffer.
 */
export function fromUint8ArrayToHex(bytes: Uint8Array): string {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    ''
  );
}

/**
 * Return an array buffer from its hexadecimal representation.
 * @param hexString The hexadecimal string.
 */
export function fromHexToArrayBuffer(hexString: string): ArrayBuffer {
  return fromHexToUint8Array(hexString).buffer;
}

/**
 * Returns an hexadecimal representation of an array buffer.
 * @param bytes The array buffer.
 */
export function fromArrayBufferToHex(bytes: ArrayBuffer): string {
  return fromUint8ArrayToHex(new Uint8Array(bytes));
}
