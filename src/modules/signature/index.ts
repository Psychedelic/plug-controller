import { sign as _sign } from 'tweetnacl';

import { Key } from "../../interfaces/account";

export const sign = (message: string, secretKey: Uint8Array) => _sign(Buffer.from(message, 'utf8'), secretKey);

export const open = (secret: Uint8Array, publicKey: string) => {
    const binary = _sign.open(secret, Buffer.from(publicKey));
    return Buffer.from(binary as ArrayBuffer).toString('utf-8');
}