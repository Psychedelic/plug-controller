import { HttpAgent, Actor, ActorSubclass } from "@dfinity/agent";


import resolverIDL from '../../../idls/icns_resolver.did';
import registryIDL from '../../../idls/icns_registry.did';
import reverseRegistrarIDL from '../../../idls/icns_reverse_registrar.did';
import Resolver, { DefaultInfoExt } from '../../../interfaces/icns_resolver';
import Registry, { RecordExt } from '../../../interfaces/icns_registry';
import ReverseRegistrar from '../../../interfaces/icns_reverse_registrar';
import { Principal } from "@dfinity/principal";
import { NFTCollection, standards } from "@psychedelic/dab-js";
import { ERRORS } from "../../../errors";

const ICNS_REGISTRY_ID = 'e5kvl-zyaaa-aaaan-qabaq-cai';
const ICNS_RESOLVER_ID = 'euj6x-pqaaa-aaaan-qabba-cai';
const ICNS_REVERSE_REGISTRAR_ID = 'etiyd-ciaaa-aaaan-qabbq-cai';
const ICNS_IMG = 'https://icns.id/Rectangle.jpg';
const ICNS_LOGO = 'https://icns.id/ICNS-logo.png';

export default class ICNSAdapter {
  #resolver: ActorSubclass<Resolver>;
  #registry: ActorSubclass<Registry>;
  #reverseRegistrar: ActorSubclass<ReverseRegistrar>;
  #agent: HttpAgent;
  constructor(agent: HttpAgent) {
    this.#agent = agent;
    this.#resolver = Actor.createActor(resolverIDL, {
      canisterId: ICNS_RESOLVER_ID,
      agent,
    });
    
    this.#registry = Actor.createActor(registryIDL, {
      canisterId: ICNS_REGISTRY_ID,
      agent,
    });

    this.#reverseRegistrar = Actor.createActor(reverseRegistrarIDL, {
      canisterId: ICNS_REVERSE_REGISTRAR_ID,
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

  public getICNSNames = async (): Promise<string[]> => {
    const names = await this.#registry.getUserDomains(await this.#agent.getPrincipal());
    return names[0]?.map(({ name }) => name) || [];
  };

  public getICNSCollection = async (): Promise<NFTCollection> => {
    let icnsNames = await this.getICNSNames();
    const formattedNames = icnsNames?.map(
      (name, index) => ({
        name: name,
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

  public getICNSReverseResolvedName = async (principalId?: string): Promise<string | undefined> => {
    const ownPrincipal = await this.#agent.getPrincipal();
    const principal = principalId ? Principal.from(principalId) : ownPrincipal;
    const name = await this.#reverseRegistrar.getName(principal);
    return name;
  }

  public setICNSReverseResolvedName = async (name: string): Promise<string> => {
      await this.resetNameRecordData(name);
      const result = await this.#reverseRegistrar.setName(name);
      if ('ok' in result) {
        return result.ok;
      }
      throw(ERRORS.ICNS_REVERSE_RESOLVER_ERROR);
  }

  public getICNSMappings = async (principalIds: string[]): Promise<{ [key: string]: string | undefined }> => {
    const mappings = {};
    await Promise.all(principalIds.map(async pid => {
      try {
        const name = await this.getICNSReverseResolvedName(pid);
        if (name) {
          mappings[name] = pid
          mappings[pid] = name;
        }
      } catch (e) {
        console.log('error getting ICNS mapping', pid, e);
      }
    }));
    return mappings;
  }

  public resetNameRecordData = async (name: string): Promise<void> => {
    try {
      const principal = await this.#agent.getPrincipal();
      await this.#resolver.setAddr(name, 'icp.principal', [principal.toString()]);
    } catch (e) {
      console.log('Error when reseting your name data', e);
    }
  }
};