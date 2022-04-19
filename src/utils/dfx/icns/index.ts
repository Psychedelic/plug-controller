import { HttpAgent, Actor, ActorSubclass } from "@dfinity/agent";


import resolverIDL from '../../../idls/icns_resolver.did';
import registryIDL from '../../../idls/icns_registry.did';
import Resolver, { DefaultInfoExt } from '../../../interfaces/icns_resolver';
import Registry, { RecordExt } from '../../../interfaces/icns_registry';
import { Principal } from "@dfinity/principal";
import { NFTCollection, standards } from "@psychedelic/dab-js";

const ICNS_REGISTRY_ID = 'e5kvl-zyaaa-aaaan-qabaq-cai';
const ICNS_RESOLVER_ID = 'euj6x-pqaaa-aaaan-qabba-cai';
const ICNS_IMG = 'https://icns.id/Rectangle.jpg';
const ICNS_LOGO = 'https://icns.id/ICNS-logo.png';

export default class ICNSAdapter {
  #resolver: ActorSubclass<Resolver>;
  #registry: ActorSubclass<Registry>;
  constructor(agent: HttpAgent) {
    this.#resolver = Actor.createActor(resolverIDL, {
      canisterId: ICNS_RESOLVER_ID,
      agent,
    });
    
    this.#registry = Actor.createActor(registryIDL, {
      canisterId: ICNS_REGISTRY_ID,
      agent,
    });
    
  }

  public resolveName = async (name: string, isICP: boolean): Promise<string | undefined> => {
    let record: [] | [DefaultInfoExt] | [RecordExt] = await this.#resolver.getUserDefaultInfo(name);
    const { icp, pid: principal } = record?.[0] || {};
    const accountId = icp?.[0];
    if (isICP && accountId) {
      return accountId;
    }
    if (!principal) {
      record = await this.#registry.getRecord(name);
      const { owner } = record?.[0] || {};
      return owner?.toString?.();
    }
    return principal?.toString?.();
  };

  public getNamesForPrincipal = async (principalId: string): Promise<NFTCollection> => {
    let icnsNames = await this.#registry.getUserDomains(Principal.from(principalId));
    const formattedNames = icnsNames?.[0]?.map(
      (icns, index) => ({
        name: icns?.name,
        url: ICNS_IMG,
        collection: 'ICNS',
        desc: 'ICNS Name Record',
        canister: ICNS_REGISTRY_ID,
        index: BigInt(index),
        metadata: {},
        standard: standards.NFT.dip721
      }),
    );
    return {
      canisterId: ICNS_REGISTRY_ID,
      description: 'ICNS .icp names',
      icon: ICNS_LOGO,
      name: 'ICNS',
      standard: standards.NFT.dip721,
      tokens: formattedNames || [],
    };
  };
}