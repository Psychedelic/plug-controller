const crc32 = require('buffer-crc32');

const wordToByteArray = (word, length) => {
	let ba: number[] = [];
	const xFF = 0xFF;
	if (length > 0)
		ba.push(word >>> 24);
	if (length > 1)
		ba.push((word >>> 16) & xFF);
	if (length > 2)
		ba.push((word >>> 8) & xFF);
	if (length > 3)
		ba.push(word & xFF);

	return ba;
}

export const wordArrayToByteArray = (wordArray, length) => {
	if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
		length = wordArray.sigBytes;
		wordArray = wordArray.words;
	}

	let result: number[] = [];
    let	bytes;
	let i = 0;
	while (length > 0) {
		bytes = wordToByteArray(wordArray[i], Math.min(4, length));
		length -= bytes.length;
		result = [...result, bytes];
		i++;
	}
	return [].concat.apply([], result);
}

export const intToHex = (val: number) => val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);

// We generate a CRC32 checksum, and trnasform it into a hexString
export const generateChecksum = (hash: Uint8Array) => {
    const crc = crc32.unsigned(Buffer.from(hash));
    const hex = intToHex(crc);
    return hex.padStart(8, '0');
}
