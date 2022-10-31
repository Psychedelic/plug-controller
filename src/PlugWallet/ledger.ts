import { polling, PublicKey } from "@dfinity/agent";
import { BinaryBlob, blobFromBuffer, blobFromUint8Array } from "@dfinity/candid";
import { Delegation, DelegationChain, DelegationIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import { BurnResult, NFTDetails, TokenInterfaces } from "@psychedelic/dab-js";

import { Address } from "../interfaces/contact_registry";
import { JSONWallet, PlugWalletArgs } from "../interfaces/plug_wallet";
import { createAgent } from "../utils/dfx";
import { GenericSignIdentity } from "../utils/identity/genericSignIdentity";
import Secp256k1KeyIdentity from "../utils/identity/secpk256k1/identity";
import PlugWallet from "./base";
import { LEDGER_CANISTER_ID } from "../utils/dfx/constants";
import { validateAccountId } from "../PlugKeyRing/utils";
import { getAccountId } from "../utils/account";
import proto, { decodeBlockHeight, formatProtoSendRequest } from "../utils/proto";
import { MINS_15_MS } from "../constants/time";

const { Certification } = proto.ic_ledger.pb.v1;

class PlugLedgerWallet extends PlugWallet {
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
      // return this.executeWithDelegation(super.transferNFT, args); // TODO: make this if identity delegation is supported later
    };

    public async burnXTC(args: { to: string; amount: string }): Promise<BurnResult> {
      throw new Error('Burn XTC not supported on Ledger');
      // return this.executeWithDelegation(super.burnXTC, args); // TODO: make this if identity delegation is supported later
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

      const canisterId = Principal.fromText(LEDGER_CANISTER_ID);

      const agent = createAgent({ defaultIdentity: this.ledgerIdentity });

      const request = formatProtoSendRequest(args, true) as Uint8Array;

      const submitResponse = await agent.call(canisterId, {
        methodName: 'send_pb',
        arg: blobFromUint8Array(request),
        effectiveCanisterId: canisterId,
      });
    
      if (!submitResponse.response?.ok) {
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
    
      return decodeBlockHeight(blob) as { height: string };
    };

    public async setReverseResolvedName (args: {
      name: string;
    }): Promise<string> {
      throw new Error('Set reverse resolve name not supported on Ledger');
      // return this.executeWithDelegation(super.setReverseResolvedName, args); // TODO: make this if identity delegation is supported later
    };

    public async addContact(args: { contact: Address; }): Promise<boolean> {
      throw new Error('Add contact not supported on Ledger');
      // return this.executeWithDelegation(super.addContact, args); // TODO: make this if identity delegation is supported later
    };

    public async deleteContact(args: { addressName: string; }): Promise<boolean> {
      throw new Error('Delete contact not supported on Ledger');
      // return this.executeWithDelegation(super.deleteContact, args); // TODO: make this if identity delegation is supported later.
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
      const pidTargets = targets?.map(target => Principal.fromText(target));
      const expiration = new Date(Date.now() + MINS_15_MS);
      const delegation = new Delegation(to.toDer(), BigInt(+expiration), pidTargets);
      const certification = Certification.fromObject(new Uint8Array(delegation.toCBOR()));

      const signature = await this.ledgerIdentity.sign(blobFromUint8Array(Certification.encode(certification).finish()));

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

export default PlugLedgerWallet;
