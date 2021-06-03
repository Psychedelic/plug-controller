const crc32 = require('buffer-crc32');

import { intToHex } from "./binary";

// We generate a CRC32 checksum, and trnasform it into a hexString
export const generateChecksum = (hash: Uint8Array) => {
    const crc = crc32.unsigned(Buffer.from(hash));
    const hex = intToHex(crc);
    return hex.padStart(8, '0');
}