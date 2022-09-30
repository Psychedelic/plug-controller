import {
  Ed25519KeyIdentity, Ed25519PublicKey
} from '@dfinity/identity';
import { GenericSignIdentity } from '../genericSignIdentity';
import {
  blobToHex,
  BinaryBlob,
} from '@dfinity/candid';
import { PublicKey } from '@dfinity/agent';

const PEM_BEGIN = `-----BEGIN EC PARAMETERS-----
BgUrgQQACg==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----`;

const PEM_END = '-----END EC PRIVATE KEY-----';

const PRIV_KEY_INIT = '3053020101300506032b657004220420';

const KEY_SEPARATOR = 'a123032100';

class Ed25519Identity extends Ed25519KeyIdentity implements GenericSignIdentity { 

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
   public toJSON(): [string, string] {
    return [blobToHex(this._publicKey.toRaw()), blobToHex(this._privateKey)];
  }

  public static fromJSON(json: string): Ed25519Identity {
    const identity = Ed25519KeyIdentity.fromJSON(json);
    const keyPair = identity.getKeyPair();
    return new Ed25519Identity(keyPair.publicKey, keyPair.secretKey);
  }

}

export default Ed25519Identity;
