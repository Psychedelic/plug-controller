import { polling, PublicKey } from "@dfinity/agent";
import { BinaryBlob, blobFromBuffer, blobFromUint8Array } from "@dfinity/candid";
import { Delegation, DelegationChain, DelegationIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import { NFTDetails, TokenInterfaces } from "@psychedelic/dab-js";
import { Address } from "../interfaces/contact_registry";
import { JSONWallet, PlugWalletArgs } from "../interfaces/plug_wallet";
import { createAgent } from "../utils/dfx";
import { GenericSignIdentity } from "../utils/identity/genericSignIdentity";
import Secp256k1KeyIdentity from "../utils/identity/secpk256k1/identity";
import PlugWallet from "./base";
import { AccountIdentifier, BlockHeight, Certification, ICPTs, Memo, Payment, SendRequest } from "../utils/proto/ledger_pb.js";
import { LEDGER_CANISTER_ID } from "../utils/dfx/constants";
import { validateAccountId } from "../PlugKeyRing/utils";
import { getAccountId } from "../utils/account";

class PlugWalletLedger extends PlugWallet {
    protected ledgerIdentity: GenericSignIdentity;

    constructor(args: PlugWalletArgs) {
      super(args);
      this.ledgerIdentity = args.identity;
      this.identity = Secp256k1KeyIdentity.ephimeral();
      this.agent = createAgent({fetch: this.fetch, defaultIdentity: this.identity});
    }

    public async sign(payload: BinaryBlob): Promise<BinaryBlob> {
      return this.ledgerIdentity.sign(payload);
    }

    public async transferNFT(args: {
      token: NFTDetails;
      to: string;
    }): Promise<boolean> {
      throw new Error('Transfer NFT not supported on Ledger');
      return this.executeWithDelegation(super.transferNFT, args);
    };

    public async burnXTC(args: { to: string; amount: string }) {
      throw new Error('Burn XTC not supported on Ledger');
      return this.executeWithDelegation(super.burnXTC, args);
    };  
    
    public async send(args: {
      to: string;
      amount: string;
      canisterId: string;
      opts?: TokenInterfaces.SendOpts;
    }): Promise<TokenInterfaces.SendResponse> {
      if (args.canisterId !== LEDGER_CANISTER_ID) {
        throw new Error(`Token ${args.canisterId} not supported on Ledger`)
      }

      const to = validateAccountId(args.to) ? args.to : getAccountId(Principal.fromText(args.to));

      if(!validateAccountId(to)) {
        throw new Error('Invalid Account ID')
      }

      console.log('to', to);

      const canisterId = Principal.fromText(LEDGER_CANISTER_ID);
    
      const agent = createAgent({defaultIdentity: this.ledgerIdentity});
      const amount = BigInt(args.amount);
      const memo = BigInt(args.opts?.memo || 0);
    
      const toPb = new AccountIdentifier();
      toPb.setHash(Uint8Array.from(Buffer.from(to, 'hex')));
      const request = new SendRequest();
      request.setTo(toPb);
    
      const payment = new Payment();
      const amountPb = new ICPTs();
      amountPb.setE8s(amount.toString(10));
      payment.setReceiverGets(amountPb);
      request.setPayment(payment);
    
      const maxFeePb = new ICPTs();
      maxFeePb.setE8s(args.opts?.fee?.toString(10) || BigInt(0).toString(10));
      request.setMaxFee(maxFeePb);
    
      const memoPb : Memo = new Memo();
      memoPb.setMemo(memo.toString(10));
      request.setMemo(memoPb);
    
      const submitResponse = await agent.call(canisterId, {
        methodName: 'send_pb',
        arg: blobFromUint8Array(request.serializeBinary()),
        effectiveCanisterId: canisterId,
      });
    
      if (!submitResponse.response.ok) {
        throw new Error(
          [
            "Call failed:",
            `  Method: send_pb`,
            `  Canister ID: ${canisterId}`,
            `  Request ID: ${submitResponse.requestId}`,
            `  HTTP status code: ${submitResponse.response.status}`,
            `  HTTP status text: ${submitResponse.response.statusText}`,
          ].join("\n")
        );
      }
    
      const blob = await polling.pollForResponse(
        agent,
        canisterId,
        submitResponse.requestId,
        polling.defaultStrategy()
      );

      const height =  BlockHeight.deserializeBinary(blob).getHeight()
    
      console.log('BLOBK HEIGH', height);
      return {
        height
      }
    };

    public async setReverseResolvedName (args: {
      name: string;
    }): Promise<string> {
      throw new Error('Set reverse resolve name not supported on Ledger');
      return this.executeWithDelegation(super.setReverseResolvedName, args);
    };

    public async addContact(args: { contact: Address; }): Promise<boolean> {
      throw new Error('Add contact not supported on Ledger');
      return this.executeWithDelegation(super.addContact, args);
    };

    public async deleteContact(args: { addressName: string; }): Promise<boolean> {
      throw new Error('Delete contact not supported on Ledger');
      return this.executeWithDelegation(super.deleteContact, args);
    };
  
    private async executeWithDelegation(methodToRun: any, args: any) {
      const oldAgent = this.agent;
      try {
        const delegatedIdentity = await this.createDelegatedIdentity()
        this.agent = createAgent({fetch: this.fetch, defaultIdentity: delegatedIdentity});
        const response = await methodToRun.bind(this)(args);
        this.agent = oldAgent;
        return response;
      } catch (e) {
        this.agent = oldAgent;
        throw e;
      }
    }
  
    private async createDelegatedIdentity(targets?: string[]) {
      const ephimeralPublic = this.identity.getPublicKey();
      const delegation = await this.delegateIdentityFromLedger({to: ephimeralPublic, targets});
      return DelegationIdentity.fromDelegation(this.identity, delegation);
    }
    
    private async delegateIdentityFromLedger({to, targets}: {to: PublicKey, targets?: string[]}) {
      const certification = new Certification();
      const pidTargets = targets?.map(target => Principal.fromText(target));
      const expiration = new Date(Date.now() + 15 * 60 * 1000);
      const delegation = new Delegation(to.toDer(), BigInt(+expiration) * BigInt(1000000), pidTargets);
      certification.setCertification(new Uint8Array(delegation.toCBOR()));


      const signature = await this.ledgerIdentity.sign(blobFromUint8Array(certification.serializeBinary()));

      return DelegationChain.fromDelegations([{delegation, signature}], this.ledgerIdentity.getPublicKey().toDer());
    }

    public toJSON(): JSONWallet{
      return {
      name: this.name,
      walletId: this.walletId,
      orderNumber: this.orderNumber,
      walletNumber: this.walletNumber,
      principal: this.principal,
      accountId: this.accountId,
      icon: this.icon,
      icnsData: this.icnsData,
      type: this.type,
      keyPair: JSON.stringify(this.ledgerIdentity.toJSON()),
    }
  };
}

export default PlugWalletLedger;