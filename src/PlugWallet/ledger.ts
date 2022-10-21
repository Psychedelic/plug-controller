import { PublicKey } from "@dfinity/agent";
import { BinaryBlob } from "@dfinity/candid";
import { DelegationChain, DelegationIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import { NFTDetails, TokenInterfaces } from "@psychedelic/dab-js";
import { Address } from "../interfaces/contact_registry";
import { JSONWallet, PlugWalletArgs } from "../interfaces/plug_wallet";
import { createAgent } from "../utils/dfx";
import { GenericSignIdentity } from "../utils/identity/genericSignIdentity";
import Secp256k1KeyIdentity from "../utils/identity/secpk256k1/identity";
import PlugWallet from "./base";

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
      return this.executeWithDelegation(super.transferNFT, args);
    };

    public async burnXTC(args: { to: string; amount: string }) {
      return this.executeWithDelegation(super.burnXTC, args);
    };  
    
    public async send(args: {
      to: string;
      amount: string;
      canisterId: string;
      opts?: TokenInterfaces.SendOpts;
    }): Promise<TokenInterfaces.SendResponse> {
      return this.executeWithDelegation(super.send, args);
    };

    public async setReverseResolvedName (args: {
      name: string;
    }): Promise<string> {
      return this.executeWithDelegation(super.setReverseResolvedName, args);
    };

    public async addContact(args: { contact: Address; }): Promise<boolean> {
      return this.executeWithDelegation(super.addContact, args);
    };

    public async deleteContact(args: { addressName: string; }): Promise<boolean> {
      return this.executeWithDelegation(super.deleteContact, args);
    };
  
    private async executeWithDelegation(methodToRun: any, args: any) {
      const oldAgent = this.agent;
      try {
        const delegatedIdentity = await this.createDelegatedIdentity()
        this.agent = createAgent({fetch: this.fetch, defaultIdentity: delegatedIdentity});
        const response = await methodToRun(args);
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
      return DelegationChain.create(this.ledgerIdentity, to, undefined, {targets: pidTargets});
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