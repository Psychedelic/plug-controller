import { sign as _sign } from 'tweetnacl';

export const sign = (message: string, secretKey: Uint8Array) => _sign(Buffer.from(message, 'utf8'), secretKey);

export const open = (secret: Uint8Array, publicKey: Uint8Array) => {
    const binary = _sign.open(secret, publicKey);
    return Buffer.from(binary as ArrayBuffer).toString('utf-8');
}