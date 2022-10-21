import {
  Ed25519KeyIdentity as baseEd25519Identity,
  Ed25519PublicKey,
} from '@dfinity/identity';
import { blobToHex, BinaryBlob } from '@dfinity/candid';
import { PublicKey } from '@dfinity/agent';
import { GenericSignIdentity } from '../genericSignIdentity';
import { JsonnableKeyPair } from '../../../interfaces/identity';

const PEM_BEGIN = `-----BEGIN EC PARAMETERS-----
BgUrgQQACg==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----`;

const PEM_END = '-----END EC PRIVATE KEY-----';

const PRIV_KEY_INIT = '3053020101300506032b657004220420';

const KEY_SEPARATOR = 'a123032100';

class Ed25519KeyIdentity extends baseEd25519Identity
  implements GenericSignIdentity {
  protected constructor(
    publicKey: PublicKey,
    protected _privateKey: BinaryBlob
  ) {
    super(publicKey, _privateKey);
    this._publicKey = Ed25519PublicKey.from(publicKey);
  }

  public getPem(): string {
    const rawPrivateKey = this._privateKey.toString('hex');
    const rawPublicKey = this._publicKey.toRaw().toString('hex');

    return `${PEM_BEGIN}\n${Buffer.from(
      `${PRIV_KEY_INIT}${rawPrivateKey}${KEY_SEPARATOR}${rawPublicKey}`,
      'hex'
    ).toString('base64')}\n${PEM_END}`;
  }

  /**
   * Serialize this key to JSON.
   */
  public toJSON(): JsonnableKeyPair {
    return [blobToHex(this._publicKey.toDer()), blobToHex(this._privateKey)];
  }

  public static fromJSON(json: string): Ed25519KeyIdentity {
    const identity = super.fromJSON(json);
    const keyPair = identity.getKeyPair();
    return new Ed25519KeyIdentity(keyPair.publicKey, keyPair.secretKey);
  }

  public static fromSecretKey(key: ArrayBuffer): Ed25519KeyIdentity {
    const identity = super.fromSecretKey(key);
    const keyPair = identity.getKeyPair();
    return new Ed25519KeyIdentity(keyPair.publicKey, keyPair.secretKey);
  }
}

export default Ed25519KeyIdentity;
