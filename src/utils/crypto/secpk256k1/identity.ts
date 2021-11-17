/* eslint-disable no-underscore-dangle */
import Secp256k1 from 'secp256k1';
import { sha256 } from 'js-sha256';

import {
  blobFromHex,
  blobFromUint8Array,
  blobToHex,
  BinaryBlob,
} from '@dfinity/candid';
import { PublicKey, SignIdentity } from '@dfinity/agent';
import Secp256k1PublicKey from './publicKey';

declare type PublicKeyHex = string;
declare type SecretKeyHex = string;
export declare type JsonableSecp256k1Identity = [PublicKeyHex, SecretKeyHex];

const PEM_BEGIN = '-----BEGIN PRIVATE KEY-----';

const PEM_END = '-----END PRIVATE KEY-----';

const PRIV_KEY_INIT =
  '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';

const KEY_SEPARATOR = 'a144034200';

class Secp256k1KeyIdentity extends SignIdentity {
  public static fromParsedJson(obj: [string, string]): Secp256k1KeyIdentity {
    const [publicKeyRaw, privateKeyRaw] = obj;
    return new Secp256k1KeyIdentity(
      Secp256k1PublicKey.fromRaw(blobFromHex(publicKeyRaw)),
      blobFromHex(privateKeyRaw)
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
            blobFromUint8Array(new Uint8Array(_publicKey.data))
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

  public static fromKeyPair(
    publicKey: BinaryBlob,
    privateKey: BinaryBlob
  ): Secp256k1KeyIdentity {
    return new Secp256k1KeyIdentity(
      Secp256k1PublicKey.fromRaw(publicKey),
      privateKey
    );
  }

  public static fromSecretKey(secretKey: ArrayBuffer): Secp256k1KeyIdentity {
    const publicKey = Secp256k1.publicKeyCreate(
      new Uint8Array(secretKey),
      false
    );
    const identity = Secp256k1KeyIdentity.fromKeyPair(
      blobFromUint8Array(publicKey),
      blobFromUint8Array(new Uint8Array(secretKey))
    );
    return identity;
  }

  protected _publicKey: Secp256k1PublicKey;

  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  protected constructor(
    publicKey: PublicKey,
    protected _privateKey: BinaryBlob
  ) {
    super();
    this._publicKey = Secp256k1PublicKey.from(publicKey);
  }

  /**
   * Serialize this key to JSON.
   */
  public toJSON(): JsonableSecp256k1Identity {
    return [blobToHex(this._publicKey.toRaw()), blobToHex(this._privateKey)];
  }

  /**
   * Return a copy of the key pair.
   */
  public getKeyPair(): {
    secretKey: BinaryBlob;
    publicKey: Secp256k1PublicKey;
  } {
    return {
      secretKey: blobFromUint8Array(new Uint8Array(this._privateKey)),
      publicKey: this._publicKey,
    };
  }

  /**
   * Return the public key.
   */
  public getPublicKey(): PublicKey {
    return this._publicKey;
  }

  /**
   *  Return private key in a pem file
   */

  public getPem(): string {
    const rawPrivateKey = this._privateKey.toString('hex');
    const rawPublicKey = this._publicKey.toRaw().toString('hex');

    return `${PEM_BEGIN}\n${Buffer.from(
      `${PRIV_KEY_INIT}${rawPrivateKey}${KEY_SEPARATOR}${rawPublicKey}`,
      'hex'
    ).toString('base64')}\n${PEM_END}`;
  }

  /**
   * Signs a blob of data, with this identity's private key.
   * @param challenge - challenge to sign with this identity's secretKey, producing a signature
   */
  public async sign(challenge: BinaryBlob): Promise<BinaryBlob> {
    const hash = sha256.create();
    hash.update(challenge);
    const { signature } = Secp256k1.ecdsaSign(
      new Uint8Array(hash.digest()),
      this._privateKey
    );
    return blobFromUint8Array(signature);
  }
}

export default Secp256k1KeyIdentity;
