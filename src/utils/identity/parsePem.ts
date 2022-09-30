import {
  Ed25519KeyIdentity
} from '@dfinity/identity';
import Secp256k1KeyIdentity from './secpk256k1/identity';
import { Types } from '../account/constants';

export class parsePem {
  public static getIdentityFromPem(pem) {
    var raw;

    pem = pem
      .replace(/(-{5}.*-{5})/g, "")
      .replace("\n", "")
      // Sepk256k1 keys
      .replace("BgUrgQQACg==", "")
      .trim();

    raw = Buffer.from(pem, "base64")
      .toString("hex")
      // Sepk256k1 keys
      .replace("30740201010420", "")
      .replace("a00706052b8104000aa144034200", "")
      // ED25519 keys
      .replace("3053020101300506032b657004220420", "")
      .replace("a123032100", "");
    const key = new Uint8Array(Buffer.from(raw.substring(0, 64), "hex"));
    var identity;
    var type;

    try {
      identity = Ed25519KeyIdentity.fromSecretKey(key);
      type = Types.pem25519;
    } catch {
      try {
        identity = Secp256k1KeyIdentity.fromSecretKey(key);
        type = Types.pem256k1;
      } catch (e) {
        console.log(e, "(e) Invalid key");
        process.exit(1);
      }
    }

    return { identity, type };
  }
}
