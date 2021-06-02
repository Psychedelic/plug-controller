import { sign as _sign } from 'tweetnacl';

import { Key } from "../../interfaces/account";

export const sign = (message: string, secretKey: Key) => _sign(Buffer.from(message, 'utf8'), secretKey.binary);

export const open = (secret: Uint8Array, publicKey: Key) => {
    const binary = _sign.open(secret, publicKey.binary);
    return Buffer.from(binary as ArrayBuffer).toString('utf-8');
}