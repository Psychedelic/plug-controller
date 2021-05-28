"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
function _bufferFromHex(hex, size = ((hex.length + 1) / 2 | 0)) {
    return new Uint8Array(hex.padStart(size * 2, '0').match(/../g).map(byte => parseInt(byte, 16)));
}
class BigIntEncoder {
    constructor() {
        this.name = 'bigint';
        this.priority = -10;
        // Double check this is available.
        if (typeof BigInt == 'undefined') {
            throw new Error('BigInt not available.');
        }
    }
    match(value) {
        return typeof value == 'bigint';
    }
    encode(v) {
        if (v >= 0) {
            return index_1.value.tagged(2, index_1.value.bytes(_bufferFromHex(v.toString(16))));
        }
        else {
            return index_1.value.tagged(3, index_1.value.bytes(_bufferFromHex(v.toString(16))));
        }
    }
}
exports.BigIntEncoder = BigIntEncoder;
//# sourceMappingURL=bigint.js.map