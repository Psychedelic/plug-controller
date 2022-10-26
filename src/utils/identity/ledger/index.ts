import { SignIdentity, PublicKey, HttpAgentRequest, ReadRequest, CallRequest, Cbor } from '@dfinity/agent';
import { BinaryBlob, blobFromBuffer} from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import DfinityApp, { ResponseSign } from '@zondax/ledger-icp';

import { JsonnableKeyPair } from '../../../interfaces/identity';
import { base64ToBytes, bytesToBase64 } from '../../encoding';
import { GenericSignIdentity } from '../genericSignIdentity';
import Secp256k1PublicKey from '../secpk256k1/publicKey';
import { Buffer as BlobBuffer } from '../../../../node_modules/buffer';

/**
 * Convert the HttpAgentRequest body into cbor which can be signed by the Ledger Hardware Wallet.
 * @param request - body of the HttpAgentRequest
 */
 export function _prepareCborForLedger(request: ReadRequest | CallRequest): BinaryBlob {
  return Cbor.encode({ content: request });
}
class LedgerIdentity extends SignIdentity implements GenericSignIdentity {

  protected derivePath: string;
  protected publicKey: PublicKey;
  protected TransportClass: any;

  public static async create(derivePath = `m/44'/223'/0'/0/0`, TransportClass: any): Promise<LedgerIdentity> {
    const transport = await TransportClass.create();
    const app = new DfinityApp(transport);

    const resp = await app.getAddressAndPubKey(derivePath);
    // This type doesn't have the right fields in it, so we have to manually type it.
    const principal = (resp as unknown as { principalText: string }).principalText;
    const publicKey = Secp256k1PublicKey.fromRaw(blobFromBuffer(new BlobBuffer(resp.publicKey)));

    if (principal !== Principal.selfAuthenticating(new Uint8Array(publicKey.toDer())).toText()) {
      throw new Error('Principal returned by device does not match public key.');
    }

    transport.close()

    return new this(derivePath, publicKey, TransportClass);
  }

  public static async fromJSON(json: string, TransportClass: any): Promise<LedgerIdentity> {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
        const derPublicKey = base64ToBytes(parsed[1]);
        const publicKey = Secp256k1PublicKey.fromDer(blobFromBuffer(new BlobBuffer(derPublicKey)));
        return new LedgerIdentity(parsed[0], publicKey, TransportClass);
      }
    }
    throw new Error(
      'Deserialization error: JSON must have at least 2 items.'
    );
  }
  
  constructor(derivePath = `m/44'/223'/0'/0/0`, publicKey: PublicKey, TransportClass: any) {
    super();
    this.derivePath = derivePath;
    this.publicKey = publicKey;
    this.TransportClass = TransportClass;
  }

  protected async _executeWithApp<T>(func: (app: DfinityApp) => T): Promise<T> {
    const transport = await this.openConnection();
    try{
      const app = new DfinityApp(transport);

      const pubKey = await app.getAddressAndPubKey(this.derivePath);  

      if (pubKey.principalText !== this.getPrincipal().toString()) {
        throw 'Principal returned by device does not match public key.';
      }
      const resp = await func(app);

      return resp
    } catch (error) {
      console.error(error);
      await this.closeConnection(transport);
      throw error;
    } finally {
      await this.closeConnection(transport);
    }
  }

  protected async openConnection(): Promise<any> {
    return this.TransportClass.openConnected();
  }

  protected async closeConnection(transport): Promise<void> {
    return transport.close();
  }

  /**
   * Required by Ledger.com that the user should be able to press a Button in UI
   * and verify the address/pubkey are the same as on the device screen.
   */
   public async showAddressAndPubKeyOnDevice(): Promise<void> {
    return this._executeWithApp(async (app) => {
      app?.showAddressAndPubKey(this.derivePath);
    });
  }

  public async sign(blob: BinaryBlob): Promise<BinaryBlob> {
    // Force an `as any` because the types are compatible but TypeScript cannot figure it out.
    return this._executeWithApp(async (app) => {
      const toSign = Buffer.from(blob)      
      const { signatureRS, ...resp }: ResponseSign = await app.sign(this.derivePath, toSign, 0);
      if (!signatureRS) {
        throw new Error(
          `A ledger error happened during signature:\n` +
            `Code: ${resp.returnCode}\n` +
            `Message: ${JSON.stringify(resp.errorMessage)}\n`,
        );
      }
  
      if (signatureRS?.byteLength !== 64) {
        throw new Error(`Signature must be 64 bytes long (is ${signatureRS.length})`);
      }
  
      return blobFromBuffer(new BlobBuffer(signatureRS));
    })

  }

  public async transformRequest(request: HttpAgentRequest): Promise<unknown> {
    const { body, ...fields } = request;
    const cbor = _prepareCborForLedger(body)
    const signature = await this.sign(cbor);
    return {
      ...fields,
      body: {
        content: body,
        sender_pubkey: this.publicKey.toDer(),
        sender_sig: signature,
      },
    };
  }

  public getPublicKey(): PublicKey {
    return this.publicKey;
  }

  public getPem(): string {
      throw new Error('Not export identity from Ledger');
  }

  public toJSON(): JsonnableKeyPair {
    const publicKey = new Uint8Array(this.publicKey.toDer());
    const publicKeyStr = bytesToBase64(publicKey);
    return [this.derivePath, publicKeyStr];
  }

  public getPrincipal(): Principal {
    return Principal.selfAuthenticating(this.publicKey.toDer())
  }
}

export default LedgerIdentity;