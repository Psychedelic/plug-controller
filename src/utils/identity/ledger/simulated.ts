import { PublicKey } from '@dfinity/agent';
import { blobFromBuffer } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import DfinityApp from '@zondax/ledger-icp';

import Secp256k1PublicKey from '../secpk256k1/publicKey';
import { Buffer as BlobBuffer } from '../../../../node_modules/buffer';
import LedgerIdentity from '.';
import { DERIVATION_PATH } from '../../account/constants';

class SimulatedLedgerIdentity extends LedgerIdentity {

  protected derivePath: string;
  protected publicKey: PublicKey;
  protected transport: any;
  protected currentTx: { [key: string]: {signatureRs, } } = {};

  public static async create(transport: any, derivePath = DERIVATION_PATH): Promise<SimulatedLedgerIdentity> {
    const app = new DfinityApp(transport);

    const resp = await app.getAddressAndPubKey(derivePath);
    // This type doesn't have the right fields in it, so we have to manually type it.
    const principal = (resp as unknown as { principalText: string }).principalText;
    const publicKey = Secp256k1PublicKey.fromRaw(blobFromBuffer(new BlobBuffer(resp.publicKey)));

    if (principal !== Principal.selfAuthenticating(new Uint8Array(publicKey.toDer())).toText()) {
      throw new Error('Principal returned by device does not match public key.');
    }

    transport.close()

    return new this(derivePath, publicKey, transport);
  }
  
  constructor(derivePath = DERIVATION_PATH, publicKey: PublicKey, transport: any) {
    super(derivePath, publicKey, {});
    this.derivePath = derivePath;
    this.publicKey = publicKey;
    this.transport = transport;
  }

  protected async openConnection(): Promise<any> {
    console.log('SIMULATED OPEN CONNECTION');
    return this.transport;
  }

  protected async closeConnection(_transport): Promise<void> {
    console.log('SIMULATED CLOSE CONNECTION');
    return;
  }
}

export default SimulatedLedgerIdentity;
