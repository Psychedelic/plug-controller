import { DerEncodedBlob } from '@dfinity/candid';
import ellipticcurve from 'starkbank-ecdsa';

export type PublicKey = typeof ellipticcurve.PublicKey;

class Secp256k1PublicKey {
  private readonly rawKey: PublicKey;

  private readonly derKey: DerEncodedBlob;

  constructor(key: PublicKey) {
    this.rawKey = key;
    this.derKey = key.toDer();
  }

  static fromRaw(rawKey: PublicKey): Secp256k1PublicKey {
    return new Secp256k1PublicKey(rawKey);
  }

  static fromDer(derKey: DerEncodedBlob): Secp256k1PublicKey {
    return new Secp256k1PublicKey(ellipticcurve.PublicKey.fromDer(derKey));
  }

  toDer(): DerEncodedBlob {
    return this.derKey;
  }

  toRaw(): PublicKey {
    return this.rawKey;
  }
}

export default Secp256k1PublicKey;
