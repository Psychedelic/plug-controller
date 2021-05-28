"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAX_U64_NUMBER = 0x20000000000000;
function _concat(a, ...args) {
    const newBuffer = new Uint8Array(a.byteLength + args.reduce((acc, b) => acc + b.byteLength, 0));
    newBuffer.set(new Uint8Array(a), 0);
    let i = a.byteLength;
    for (const b of args) {
        newBuffer.set(new Uint8Array(b), i);
        i += b.byteLength;
    }
    return newBuffer.buffer;
}
function _serializeValue(major, minor, value) {
    // Remove everything that's not an hexadecimal character. These are not
    // considered errors since the value was already validated and they might
    // be number decimals or sign.
    value = value.replace(/[^0-9a-fA-F]/g, "");
    // Create the buffer from the value with left padding with 0.
    const length = 2 ** (minor - 24 /* Int8 */);
    value = value.slice(-length * 2).padStart(length * 2, "0");
    const bytes = [(major << 5) + minor].concat(value.match(/../g).map((byte) => parseInt(byte, 16)));
    return new Uint8Array(bytes).buffer;
}
function _serializeNumber(major, value) {
    if (value < 24) {
        return new Uint8Array([(major << 5) + value]).buffer;
    }
    else {
        const minor = value <= 0xff
            ? 24 /* Int8 */
            : value <= 0xffff
                ? 25 /* Int16 */
                : value <= 0xffffffff
                    ? 26 /* Int32 */
                    : 27 /* Int64 */;
        return _serializeValue(major, minor, value.toString(16));
    }
}
function _serializeString(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) {
            utf8.push(charcode);
        }
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        else {
            // Surrogate pair
            i++;
            charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff);
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }
    return _concat(new Uint8Array(_serializeNumber(3 /* TextString */, str.length)), new Uint8Array(utf8));
}
/**
 * Tag a value.
 */
function tagged(tag, value) {
    if (tag == 0xd9d9f7) {
        return _concat(new Uint8Array([0xd9, 0xd9, 0xf7]), value);
    }
    if (tag < 24) {
        return _concat(new Uint8Array([(6 /* Tag */ << 5) + tag]), value);
    }
    else {
        const minor = tag <= 0xff
            ? 24 /* Int8 */
            : tag <= 0xffff
                ? 25 /* Int16 */
                : tag <= 0xffffffff
                    ? 26 /* Int32 */
                    : 27 /* Int64 */;
        const length = 2 ** (minor - 24 /* Int8 */);
        const value = tag
            .toString(16)
            .slice(-length * 2)
            .padStart(length * 2, "0");
        const bytes = [(6 /* Tag */ << 5) + minor].concat(value.match(/../g).map((byte) => parseInt(byte, 16)));
        return new Uint8Array(bytes).buffer;
    }
}
exports.tagged = tagged;
/**
 * Set the raw bytes contained by this value. This should only be used with another
 * CborValue, or if you are implementing extensions to CBOR.
 * @param bytes A buffer containing the value.
 */
function raw(bytes) {
    return new Uint8Array(bytes).buffer;
}
exports.raw = raw;
/**
 * Encode a number that is between [0, 23].
 * @param n
 */
function uSmall(n) {
    if (isNaN(n)) {
        throw new RangeError("Invalid number.");
    }
    n = Math.min(Math.max(0, n), 23); // Clamp it.
    const bytes = [(0 /* UnsignedInteger */ << 5) + n];
    return new Uint8Array(bytes).buffer;
}
exports.uSmall = uSmall;
function u8(u8, radix) {
    // Force u8 into a number, and validate it.
    u8 = parseInt("" + u8, radix);
    if (isNaN(u8)) {
        throw new RangeError("Invalid number.");
    }
    u8 = Math.min(Math.max(0, u8), 0xff); // Clamp it.
    u8 = u8.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 24 /* Int8 */, u8);
}
exports.u8 = u8;
function u16(u16, radix) {
    // Force u16 into a number, and validate it.
    u16 = parseInt("" + u16, radix);
    if (isNaN(u16)) {
        throw new RangeError("Invalid number.");
    }
    u16 = Math.min(Math.max(0, u16), 0xffff); // Clamp it.
    u16 = u16.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 25 /* Int16 */, u16);
}
exports.u16 = u16;
function u32(u32, radix) {
    // Force u32 into a number, and validate it.
    u32 = parseInt("" + u32, radix);
    if (isNaN(u32)) {
        throw new RangeError("Invalid number.");
    }
    u32 = Math.min(Math.max(0, u32), 0xffffffff); // Clamp it.
    u32 = u32.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 26 /* Int32 */, u32);
}
exports.u32 = u32;
function u64(u64, radix) {
    // Special consideration for numbers that might be larger than expected.
    if (typeof u64 == "string" && radix == 16) {
        // This is the only case where we guarantee we'll encode the number directly.
        // Validate it's all hexadecimal first.
        if (u64.match(/[^0-9a-fA-F]/)) {
            throw new RangeError("Invalid number.");
        }
        return _serializeValue(0 /* UnsignedInteger */, 27 /* Int64 */, u64);
    }
    // Force u64 into a number, and validate it.
    u64 = parseInt("" + u64, radix);
    if (isNaN(u64)) {
        throw new RangeError("Invalid number.");
    }
    u64 = Math.min(Math.max(0, u64), MAX_U64_NUMBER); // Clamp it to actual limit.
    u64 = u64.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 27 /* Int64 */, u64);
}
exports.u64 = u64;
/**
 * Encode a negative number that is between [-24, -1].
 */
function iSmall(n) {
    if (isNaN(n)) {
        throw new RangeError("Invalid number.");
    }
    if (n === 0) {
        return uSmall(0);
    }
    // Negative n, clamped to [1, 24], minus 1 (there's no negative 0).
    n = Math.min(Math.max(0, -n), 24) - 1;
    const bytes = [(1 /* SignedInteger */ << 5) + n];
    return new Uint8Array(bytes).buffer;
}
exports.iSmall = iSmall;
function i8(i8, radix) {
    // Force i8 into a number, and validate it.
    i8 = parseInt("" + i8, radix);
    if (isNaN(i8)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i8 = Math.min(Math.max(0, -i8 - 1), 0xff);
    i8 = i8.toString(16);
    return _serializeValue(1 /* SignedInteger */, 24 /* Int8 */, i8);
}
exports.i8 = i8;
function i16(i16, radix) {
    // Force i16 into a number, and validate it.
    i16 = parseInt("" + i16, radix);
    if (isNaN(i16)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i16 = Math.min(Math.max(0, -i16 - 1), 0xffff);
    i16 = i16.toString(16);
    return _serializeValue(1 /* SignedInteger */, 25 /* Int16 */, i16);
}
exports.i16 = i16;
function i32(i32, radix) {
    // Force i32 into a number, and validate it.
    i32 = parseInt("" + i32, radix);
    if (isNaN(i32)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i32 = Math.min(Math.max(0, -i32 - 1), 0xffffffff);
    i32 = i32.toString(16);
    return _serializeValue(1 /* SignedInteger */, 26 /* Int32 */, i32);
}
exports.i32 = i32;
function i64(i64, radix) {
    // Special consideration for numbers that might be larger than expected.
    if (typeof i64 == "string" && radix == 16) {
        if (i64.startsWith("-")) {
            i64 = i64.slice(1);
        }
        else {
            // Clamp it.
            i64 = "0";
        }
        // This is the only case where we guarantee we'll encode the number directly.
        // Validate it's all hexadecimal first.
        if (i64.match(/[^0-9a-fA-F]/) || i64.length > 16) {
            throw new RangeError("Invalid number.");
        }
        // We need to do -1 to the number.
        let done = false;
        let newI64 = i64.split("").reduceRight((acc, x) => {
            if (done) {
                return x + acc;
            }
            let n = parseInt(x, 16) - 1;
            if (n >= 0) {
                done = true;
                return n.toString(16) + acc;
            }
            else {
                return "f" + acc;
            }
        }, "");
        if (!done) {
            // This number was 0.
            return u64(0);
        }
        return _serializeValue(1 /* SignedInteger */, 27 /* Int64 */, newI64);
    }
    // Force i64 into a number, and validate it.
    i64 = parseInt("" + i64, radix);
    if (isNaN(i64)) {
        throw new RangeError("Invalid number.");
    }
    i64 = Math.min(Math.max(0, -i64 - 1), 0x20000000000000); // Clamp it to actual.
    i64 = i64.toString(16);
    return _serializeValue(1 /* SignedInteger */, 27 /* Int64 */, i64);
}
exports.i64 = i64;
/**
 * Encode a number using the smallest amount of bytes, by calling the methods
 * above. e.g. If the number fits in a u8, it will use that.
 */
function number(n) {
    if (n >= 0) {
        if (n < 24) {
            return uSmall(n);
        }
        else if (n <= 0xff) {
            return u8(n);
        }
        else if (n <= 0xffff) {
            return u16(n);
        }
        else if (n <= 0xffffffff) {
            return u32(n);
        }
        else {
            return u64(n);
        }
    }
    else {
        if (n >= -24) {
            return iSmall(n);
        }
        else if (n >= -0xff) {
            return i8(n);
        }
        else if (n >= -0xffff) {
            return i16(n);
        }
        else if (n >= -0xffffffff) {
            return i32(n);
        }
        else {
            return i64(n);
        }
    }
}
exports.number = number;
/**
 * Encode a byte array. This is different than the `raw()` method.
 */
function bytes(bytes) {
    return _concat(_serializeNumber(2 /* ByteString */, bytes.byteLength), bytes);
}
exports.bytes = bytes;
/**
 * Encode a JavaScript string.
 */
function string(str) {
    return _serializeString(str);
}
exports.string = string;
/**
 * Encode an array of cbor values.
 */
function array(items) {
    return _concat(_serializeNumber(4 /* Array */, items.length), ...items);
}
exports.array = array;
/**
 * Encode a map of key-value pairs. The keys are string, and the values are CBOR
 * encoded.
 */
function map(items, stable = false) {
    if (!(items instanceof Map)) {
        items = new Map(Object.entries(items));
    }
    let entries = Array.from(items.entries());
    if (stable) {
        entries = entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    }
    return _concat(_serializeNumber(5 /* Map */, items.size), ...entries.map(([k, v]) => _concat(_serializeString(k), v)));
}
exports.map = map;
/**
 * Encode a single (32 bits) precision floating point number.
 */
function singleFloat(f) {
    const single = new Float32Array([f]);
    return _concat(new Uint8Array([(7 /* SimpleValue */ << 5) + 26]), new Uint8Array(single.buffer));
}
exports.singleFloat = singleFloat;
/**
 * Encode a double (64 bits) precision floating point number.
 */
function doubleFloat(f) {
    const single = new Float64Array([f]);
    return _concat(new Uint8Array([(7 /* SimpleValue */ << 5) + 27]), new Uint8Array(single.buffer));
}
exports.doubleFloat = doubleFloat;
function bool(v) {
    return v ? true_() : false_();
}
exports.bool = bool;
/**
 * Encode the boolean true.
 */
function true_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 21]));
}
exports.true_ = true_;
/**
 * Encode the boolean false.
 */
function false_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 20]));
}
exports.false_ = false_;
/**
 * Encode the constant null.
 */
function null_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 22]));
}
exports.null_ = null_;
/**
 * Encode the constant undefined.
 */
function undefined_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 23]));
}
exports.undefined_ = undefined_;
//# sourceMappingURL=value.js.map