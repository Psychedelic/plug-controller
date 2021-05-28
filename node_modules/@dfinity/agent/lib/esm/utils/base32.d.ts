/**
 * @param input The input array to encode.
 * @returns A Base32 string encoding the input.
 */
export declare function encode(input: Uint8Array): string;
/**
 * @param input The base32 encoded string to decode.
 */
export declare function decode(input: string): Uint8Array;
