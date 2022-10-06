
import Secp256k1KeyIdentity from './secpk256k1/identity';
import Ed25519KeyIdentity from './ed25519/ed25519Identity';
import { Types } from '../account/constants';
import { ERRORS } from '../../errors';

export const parseEd25519 = (pem: string) => {

  const raw = Buffer.from(pem, "base64")
    .toString("hex")
    .replace("3053020101300506032b657004220420", "")
    .replace("a123032100", "");

  try {
    const key = new Uint8Array(Buffer.from(raw, "hex"));
    const identity = Ed25519KeyIdentity.fromSecretKey(key);
    const type = Types.pem25519;
    return { identity, type };
  } catch {
    return undefined
  }
}

export const parseSec256K1 = (pem: string) => {

  const raw = Buffer.from(pem, "base64")
    .toString("hex")
    .replace("30740201010420", "")
    .replace("a00706052b8104000aa144034200", "")

  try {
    const key = new Uint8Array(Buffer.from(raw.substring(0, 64), "hex"));
    const identity = Secp256k1KeyIdentity.fromSecretKey(key);
    const type = Types.pem256k1;
    return { identity, type };
  } catch {
    return undefined;
  }
}

export const getIdentityFromPem = (pem) => {

  const trimedPem = pem
    .replace(/(-{5}.*-{5})/g, "")
    .replace("\n", "")
    // Sepk256k1 keys
    .replace("BgUrgQQACg==", "")
    .trim();

  const parsedIdentity = parseEd25519(trimedPem) || parseSec256K1(trimedPem);

  if (!parsedIdentity) throw new Error(ERRORS.INVALID_KEY);
  
  return parsedIdentity;

}
