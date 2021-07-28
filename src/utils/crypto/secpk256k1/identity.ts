/* eslint-disable no-underscore-dangle */
import EllipticCurve from 'starkbank-ecdsa';
import * as BigintConversion from 'bigint-conversion';

import {
  blobFromHex,
  blobFromUint8Array,
  blobToHex,
  blobFromBuffer,
  BinaryBlob,
  derBlobFromBlob,
} from '@dfinity/candid';
import { SignIdentity } from '@dfinity/agent';
import Secp256k1PublicKey, { PublicKey } from './publicKey';
import { Secp256k1KeyPair } from '../keys';

const { PrivateKey, Ecdsa } = EllipticCurve;

declare type PublicKeyHex = string;
declare type SecretKeyHex = string;
export declare type JsonableSecp256k1Identity = [PublicKeyHex, SecretKeyHex];

class Secp256k1KeyIdentity extends SignIdentity {
  protected _publicKey;

  protected _privateKey;

  constructor(
    publicKey: Secp256k1PublicKey,
    privateKey: typeof EllipticCurve.PrivateKey
  ) {
    super();
    this._privateKey = privateKey;
    this._publicKey = publicKey;
  }

  static fromPem(pem): Secp256k1KeyIdentity {
    if (!pem) throw new Error('Identity creation failed: PEM is required');
    try {
      const privateKey = PrivateKey.fromPem(pem);
      const publicKey = privateKey.publicKey();
      return new Secp256k1KeyIdentity(
        Secp256k1PublicKey.fromRaw(publicKey),
        privateKey
      );
    } catch (e) {
      throw new Error(`Identity creation failed: ${e}.`);
    }
  }

  static fromParsedJson(obj: JsonableSecp256k1Identity): Secp256k1KeyIdentity {
    const [publicKeyDer, privateKeyDer] = obj;
    return new Secp256k1KeyIdentity(
      Secp256k1PublicKey.fromDer(derBlobFromBlob(blobFromHex(publicKeyDer))),
      PrivateKey.fromDer(blobFromHex(privateKeyDer))
    );
  }

  public static fromJSON(json: string): Secp256k1KeyIdentity {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
        return this.fromParsedJson([parsed[0], parsed[1]]);
      }
      throw new Error(
        'Deserialization error: JSON must have at least 2 items.'
      );
    } else if (typeof parsed === 'object' && parsed !== null) {
      const { publicKey, _publicKey, secretKey, _privateKey } = parsed;
      const pk = publicKey
        ? Secp256k1PublicKey.fromRaw(
            blobFromUint8Array(new Uint8Array(publicKey.data))
          )
        : Secp256k1PublicKey.fromDer(
            derBlobFromBlob(blobFromUint8Array(new Uint8Array(_publicKey.data)))
          );

      if (publicKey && secretKey && secretKey.data) {
        return new Secp256k1KeyIdentity(
          pk,
          blobFromUint8Array(new Uint8Array(secretKey.data))
        );
      }
      if (_publicKey && _privateKey && _privateKey.data) {
        return new Secp256k1KeyIdentity(
          pk,
          blobFromUint8Array(new Uint8Array(_privateKey.data))
        );
      }
    }
    throw new Error(
      `Deserialization error: Invalid JSON type for string: ${JSON.stringify(
        json
      )}`
    );
  }

  static fromKeyPair(
    publicKey: PublicKey,
    privateKey: typeof EllipticCurve.PrivateKey
  ): Secp256k1KeyIdentity {
    return new Secp256k1KeyIdentity(
      Secp256k1PublicKey.fromDer(publicKey.toDer()),
      privateKey
    );
  }

  public static fromSecretKey(secretKey: ArrayBuffer): Secp256k1KeyIdentity {
    const privateKey = PrivateKey.from(new Uint8Array(secretKey));
    const identity = Secp256k1KeyIdentity.fromKeyPair(
      blobFromHex(privateKey.publicKey.toString()),
      blobFromHex(privateKey.toString())
    );
    return identity;
  }

  /**
   * Serialize this key to JSON.
   */
  toJSON(): JsonableSecp256k1Identity {
    return [
      blobToHex(this._publicKey.toDer()),
      blobToHex(this._privateKey.toDer()),
    ];
  }

  /**
   * Return a copy of the key pair.
   */
  getKeyPair(): Secp256k1KeyPair {
    return {
      privateKey: this._privateKey,
      publicKey: this._publicKey.toRaw(),
    };
  }

  /**
   * Return the public key.
   */
  getPublicKey(): Secp256k1PublicKey {
    return this._publicKey;
  }

  /**
   * Signs a blob of data, with this identity's private key.
   * @param challenge - challenge to sign with this identity's secretKey, producing a signature
   */
  async sign(challenge: BinaryBlob): Promise<BinaryBlob> {
    const blob =
      challenge instanceof Buffer
        ? blobFromBuffer(challenge)
        : blobFromUint8Array(new Uint8Array(challenge));
    const signature = Ecdsa.sign(blob, this._privateKey);

    const ra = BigintConversion.bigintToBuf(signature.r);
    const sa = BigintConversion.bigintToBuf(signature.s);

    // const ra = BigintBuffer.toBufferBE(signature.r, 32);
    // const sa = BigintBuffer.toBufferBE(signature.s, 32);
    return blobFromUint8Array(
      new Uint8Array([
        ...Array.from(new Uint8Array(ra)),
        ...Array.from(new Uint8Array(sa)),
      ])
    );
  }
}

export default Secp256k1KeyIdentity;
