import { SignIdentity, PublicKey, HttpAgentRequest } from '@dfinity/agent';
import { BinaryBlob } from '@dfinity/candid';
import { LedgerIdentity as BaseIdentity} from '@dfinity/identity-ledgerhq'
import { JsonnableKeyPair } from '../../../interfaces/identity';
import { GenericSignIdentity } from '../genericSignIdentity';

class LedgerIdentity extends SignIdentity implements GenericSignIdentity {

  protected baseIdentity: BaseIdentity;
  protected derivePath: string;

  public static async create(derivePath = `m/44'/223'/0'/0/0`): Promise<LedgerIdentity> {
      const baseIdentity = await BaseIdentity.create(derivePath);
      return new LedgerIdentity(baseIdentity, derivePath);
    }

  public static fromJSON(json: string): Promise<LedgerIdentity> {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
        return this.create(parsed[0]);
      }
    }
    throw new Error(
      'Deserialization error: JSON must have at least 2 items.'
    );
  }
  
  constructor(baseIdentity: BaseIdentity, derivePath = `m/44'/223'/0'/0/0`) {
      super();
      this.baseIdentity = baseIdentity;
      this.derivePath = derivePath;
  }


  /**
   * Required by Ledger.com that the user should be able to press a Button in UI
   * and verify the address/pubkey are the same as on the device screen.
   */
  public async showAddressAndPubKeyOnDevice(): Promise<void> {
    await this.baseIdentity.showAddressAndPubKeyOnDevice;
  } 

  public getPublicKey(): PublicKey {
    return this.baseIdentity.getPublicKey();
  }

  public async sign(blob: ArrayBuffer): Promise<BinaryBlob> {
    return this.baseIdentity.sign(blob);
  }

  public async transformRequest(request: HttpAgentRequest): Promise<unknown> {
    return this.baseIdentity.transformRequest(request);
  }

  public getPem(): string {
      throw new Error('Not export identity from Ledger');
  }

  public toJSON(): JsonnableKeyPair {
      return [this.derivePath, this.getPublicKey().toDer().toString()];
  }
}

export default LedgerIdentity;