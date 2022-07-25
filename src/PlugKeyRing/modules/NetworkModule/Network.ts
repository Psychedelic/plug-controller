import { uuid } from "uuidv4";
import { HttpAgent } from "@dfinity/agent";
import { getTokenActor, standards } from "@psychedelic/dab-js";

import { ERRORS } from "../../../errors";
import { validateCanisterId } from "../../utils";
import { IC_URL_HOST, PLUG_PROXY_HOST } from "../../../utils/dfx/constants";
import { DEFAULT_TOKENS, TOKENS } from "../../../constants/tokens";
import { StandardToken } from "../../../interfaces/token";

export type NetworkParams = {
  name: string;
  host: string;
  ledgerCanisterId?: string;
  registeredTokens?: RegisteredToken[];
  id?: string;
}

export type EditNetworkParams = {
  name?: string;
  host?: string;
  ledgerCanisterId?: string;
}

export type RegisteredToken = StandardToken & { registered: boolean };

// Function that takes in an array of tokens and returns an array without duplicates
export const uniqueTokens = (tokens: RegisteredToken[]) => {
  const uniqueTokens = tokens.filter((token, index) => {
    return tokens.findIndex(t => t.canisterId === token.canisterId) === index;
  });
  return uniqueTokens;
}

export class Network {
  public name: string;
  public host: string;
  public ledgerCanisterId?: string;
  public id: string;
  public shouldProxy: boolean;
  public registeredTokens: RegisteredToken[];

  constructor(networkParams: NetworkParams) {
    this.name = networkParams.name;
    this.host = networkParams.host;

    this.id = uuid();
    this.shouldProxy = false;
    if (networkParams.registeredTokens) {
      this.registeredTokens = [...networkParams.registeredTokens];
    } else {
      // If ledger canister ID is present, add ICP as a default token.
      this.registeredTokens = [{
        name: 'ICP',
        symbol: 'ICP',
        canisterId: networkParams.ledgerCanisterId || '',
        standard: standards.TOKEN.icp,
        decimals: 8,
        registered: true,
      }];
    }
  }

  public edit({ name, host, ledgerCanisterId }: EditNetworkParams) {
    this.name = name || this.name;
    this.host = host || this.host;
    this.ledgerCanisterId = ledgerCanisterId || this.ledgerCanisterId;
  }

  public getTokenInfo = async ({ canisterId, standard }) => {
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const agent = new HttpAgent({ host: this.host });
    const tokenActor = await getTokenActor({ canisterId, standard, agent });
    const metadata = await tokenActor.getMetadata();
    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const token = { ...metadata.fungible, canisterId, standard, registered: false };
    this.registeredTokens = uniqueTokens([...this.registeredTokens, token]);
    return token;
  }

  public registerToken = async ({ canisterId, standard }: { canisterId: string, standard: string }) => {
    const token = this.registeredTokens.find(({ canisterId: id }) => id === canisterId);
    if (!token) {
      await this.getTokenInfo({ canisterId, standard });
    }
    this.registeredTokens = this.registeredTokens.map(
      t => t.canisterId === canisterId ? { ...t, registered: true } : t
    );
    return this.registeredTokens;
  }

  public removeToken = async ({ canisterId }: { canisterId: string }): Promise<RegisteredToken[]> => {
    if (!this.registeredTokens.map(t => t.canisterId).includes(canisterId)) {
      return this.registeredTokens;
    }
    const newTokens = this.registeredTokens.filter(t => t.canisterId !== canisterId);
    this.registeredTokens = newTokens;
    return newTokens;
  };

  public toJSON(): NetworkParams {
    return {
      name: this.name,
      host: this.host,
      ledgerCanisterId: this.ledgerCanisterId,
      registeredTokens: this.registeredTokens,
      id: this.id,
    };
  }
}



export class Mainnet extends Network {
  constructor(networkParams?: NetworkParams) {
    super({
      ...networkParams,
      ledgerCanisterId: TOKENS.ICP.canisterId,
      name: 'Mainnet',
      host: `https://${IC_URL_HOST}`,
    });
    this.id = 'mainnet';
    this.shouldProxy = true;

    this.registeredTokens = uniqueTokens([
      ...DEFAULT_TOKENS.map((t) => ({ ...t , registered: true })),
      ...this.registeredTokens
    ]);
  }

  public edit(): void {
    return;
  }
}