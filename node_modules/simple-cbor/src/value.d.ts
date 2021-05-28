export declare type CborValue = ArrayBuffer & {
    __brand: "CBOR";
};
/**
 * Tag a value.
 */
export declare function tagged(tag: number, value: CborValue): CborValue;
/**
 * Set the raw bytes contained by this value. This should only be used with another
 * CborValue, or if you are implementing extensions to CBOR.
 * @param bytes A buffer containing the value.
 */
export declare function raw(bytes: Uint8Array): CborValue;
/**
 * Encode a number that is between [0, 23].
 * @param n
 */
export declare function uSmall(n: number): CborValue;
/**
 * Encode a number that is between [0, 255].
 */
export declare function u8(u8: number): CborValue;
/**
 * Encode a number that is between [0, 255], passed as a string.
 */
export declare function u8(u8: string, radix?: number): CborValue;
/**
 * Encode a number that is between [0, 65535].
 */
export declare function u16(u16: number): CborValue;
/**
 * Encode a number that is between [0, 65535], passed as a string.
 */
export declare function u16(u16: string, radix?: number): CborValue;
/**
 * Encode a number that is between [0, 2^32 - 1].
 */
export declare function u32(u32: number): CborValue;
/**
 * Encode a number that is between [0, 2^32 - 1], passed as a string.
 */
export declare function u32(u32: string, radix?: number): CborValue;
/**
 * Encode a number that is between [0, 2^64 - 1]. This cannot encode all values and
 * is lossy for very large numbers (above 2^52). Use the string version (with radix 16)
 * to pass direct numbers.
 */
export declare function u64(u64: number): CborValue;
/**
 * Encode a number that is between [0, 2^64 - 1], passed as a string.
 */
export declare function u64(u64: string, radix?: number): CborValue;
/**
 * Encode a negative number that is between [-24, -1].
 */
export declare function iSmall(n: number): CborValue;
/**
 * Encode a negative number that is between [-256, -1].
 */
export declare function i8(i8: number): CborValue;
export declare function i8(i8: string, radix?: number): CborValue;
/**
 * Encode a negative number that is between [-65536, -1].
 */
export declare function i16(i16: number): CborValue;
export declare function i16(i16: string, radix?: number): CborValue;
/**
 * Encode a negative number that is between [-2^32, -1].
 */
export declare function i32(i32: number): CborValue;
export declare function i32(i32: string, radix?: number): CborValue;
/**
 * Encode a negative number that is between [-2^64, -1].
 */
export declare function i64(i64: number): CborValue;
export declare function i64(i64: string, radix?: number): CborValue;
/**
 * Encode a number using the smallest amount of bytes, by calling the methods
 * above. e.g. If the number fits in a u8, it will use that.
 */
export declare function number(n: number): CborValue;
/**
 * Encode a byte array. This is different than the `raw()` method.
 */
export declare function bytes(bytes: ArrayBuffer): CborValue;
/**
 * Encode a JavaScript string.
 */
export declare function string(str: string): CborValue;
/**
 * Encode an array of cbor values.
 */
export declare function array(items: CborValue[]): CborValue;
/**
 * Encode a map of key-value pairs. The keys are string, and the values are CBOR
 * encoded.
 */
export declare function map(items: Map<string, CborValue> | {
    [key: string]: CborValue;
}, stable?: boolean): CborValue;
/**
 * Encode a single (32 bits) precision floating point number.
 */
export declare function singleFloat(f: number): CborValue;
/**
 * Encode a double (64 bits) precision floating point number.
 */
export declare function doubleFloat(f: number): CborValue;
export declare function bool(v: boolean): CborValue;
/**
 * Encode the boolean true.
 */
export declare function true_(): CborValue;
/**
 * Encode the boolean false.
 */
export declare function false_(): CborValue;
/**
 * Encode the constant null.
 */
export declare function null_(): CborValue;
/**
 * Encode the constant undefined.
 */
export declare function undefined_(): CborValue;
