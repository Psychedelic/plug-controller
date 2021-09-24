/* eslint-disable no-underscore-dangle */
import { Secp256k1KeyIdentity, Secp256k1PublicKey } from '@dfinity/identity';
import Secp256k1 from 'secp256k1';
import { randomBytes } from 'tweetnacl';

const PEM_BEGIN = '-----BEGIN PRIVATE KEY-----';

const PEM_END = '-----END PRIVATE KEY-----';

const PRIV_KEY_INIT =
  '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';

const KEY_SEPARATOR = 'a144034200';

const fromHexString = (hexString: string): ArrayBuffer => {
  return new Uint8Array(
    (hexString.match(/.{1,2}/g) ?? []).map(byte => parseInt(byte, 16))
  ).buffer;
};

declare type PublicKeyHex = string;
declare type SecretKeyHex = string;
export declare type JsonableSecp256k1Identity = [PublicKeyHex, SecretKeyHex];
class PlugSecp256k1KeyIdentity extends Secp256k1KeyIdentity {
  /**
   * Generates an identity. If a seed is provided, the keys are generated from the
   * seed according to BIP 0032. Otherwise, the key pair is randomly generated.
   * This method throws an error in case the seed is not 32 bytes long or invalid
   * for use as a private key.
   * @param {Uint8Array} seed the optional seed
   * @returns {PlugSecp256k1KeyIdentity}
   */
  public static generate(seed?: Uint8Array): PlugSecp256k1KeyIdentity {
    if (seed && seed.byteLength !== 32) {
      throw new Error('Secp256k1 Seed needs to be 32 bytes long.');
    }
    let privateKey: Uint8Array;

    if (seed) {
      // private key from seed according to https://en.bitcoin.it/wiki/BIP_0032
      // master key generation:
      privateKey = seed;
      if (!Secp256k1.privateKeyVerify(privateKey)) {
        throw new Error('The seed is invalid.');
      }
    } else {
      privateKey = new Uint8Array(randomBytes(32));
      while (!Secp256k1.privateKeyVerify(privateKey)) {
        privateKey = new Uint8Array(randomBytes(32));
      }
    }

    const publicKeyRaw = Secp256k1.publicKeyCreate(privateKey, false);

    const publicKey = Secp256k1PublicKey.fromRaw(publicKeyRaw);
    return new this(publicKey, privateKey);
  }

  public static fromParsedJson(
    obj: JsonableSecp256k1Identity
  ): PlugSecp256k1KeyIdentity {
    const [publicKeyRaw, privateKeyRaw] = obj;
    return new PlugSecp256k1KeyIdentity(
      Secp256k1PublicKey.fromRaw(fromHexString(publicKeyRaw)),
      fromHexString(privateKeyRaw)
    );
  }

  public static fromJSON(json: string): PlugSecp256k1KeyIdentity {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
        return this.fromParsedJson([parsed[0], parsed[1]]);
      }
      throw new Error(
        'Deserialization error: JSON must have at least 2 items.'
      );
    }
    throw new Error(
      `Deserialization error: Invalid JSON type for string: ${JSON.stringify(
        json
      )}`
    );
  }

  /**
   * generates an identity from a public and private key. Please ensure that you are generating these keys securely and protect the user's private key
   * @param {ArrayBuffer} publicKey
   * @param {ArrayBuffer} privateKey
   * @returns {PlugSecp256k1KeyIdentity}
   */
  public static fromKeyPair(
    publicKey: ArrayBuffer,
    privateKey: ArrayBuffer
  ): PlugSecp256k1KeyIdentity {
    return new PlugSecp256k1KeyIdentity(
      Secp256k1PublicKey.fromRaw(publicKey),
      privateKey
    );
  }

  /**
   * generates an identity from an existing secret key, and is the correct method to generate an identity from a seed phrase. Please ensure you protect the user's private key.
   * @param {ArrayBuffer} secretKey
   * @returns {PlugSecp256k1KeyIdentity}
   */
  public static fromSecretKey(
    secretKey: ArrayBuffer
  ): PlugSecp256k1KeyIdentity {
    const publicKey = Secp256k1.publicKeyCreate(
      new Uint8Array(secretKey),
      false
    );
    const identity = PlugSecp256k1KeyIdentity.fromKeyPair(
      publicKey,
      new Uint8Array(secretKey)
    );
    return identity;
  }

  protected constructor(
    publicKey: Secp256k1PublicKey,
    protected _privateKey: ArrayBuffer
  ) {
    super(publicKey, _privateKey);
  }

  public getPem(): string {
    const rawPrivateKey = Buffer.from(this._privateKey).toString('hex');
    const rawPublicKey = Buffer.from(this._publicKey.toRaw()).toString('hex');

    return `${PEM_BEGIN}\n${Buffer.from(
      `${PRIV_KEY_INIT}${rawPrivateKey}${KEY_SEPARATOR}${rawPublicKey}`,
      'hex'
    ).toString('base64')}\n${PEM_END}`;
  }
}

export default PlugSecp256k1KeyIdentity;
