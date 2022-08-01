import { v4 as uuid } from "uuid";
import { HttpAgent } from "@dfinity/agent";
import { getTokenActor, standards } from "@psychedelic/dab-js";

import { ERRORS } from "../../../errors";
import { validateCanisterId } from "../../utils";
import { IC_URL_HOST, PLUG_PROXY_HOST } from "../../../utils/dfx/constants";
import { DEFAULT_MAINNET_TOKENS, TOKENS } from "../../../constants/tokens";
import { StandardToken } from "../../../interfaces/token";
import { KeyringStorage } from "../../../interfaces/storage";

export type NetworkParams = {
  name: string;
  host: string;
  ledgerCanisterId?: string;
  registeredTokens?: RegisteredToken[];
  id?: string;
  onChange?: () => void;
}

export type EditNetworkParams = {
  name?: string;
  host?: string;
  ledgerCanisterId?: string;
}

export type RegisteredToken = StandardToken & { registeredBy: Array<number> };

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
  public isCustom: boolean;
  public defaultTokens: StandardToken[];
  public registeredTokens: RegisteredToken[];
  private onChange;

  constructor(networkParams: NetworkParams) {
    this.name = networkParams.name;
    this.host = networkParams.host;
    this.onChange = networkParams.onChange;
    this.id = networkParams?.id || uuid();
    this.isCustom = true;
    this.ledgerCanisterId = networkParams.ledgerCanisterId || '';
    this.defaultTokens = [{
      name: 'ICP',
      symbol: 'ICP',
      canisterId: networkParams.ledgerCanisterId || '',
      standard: standards.TOKEN.icp,
      decimals: 8,
    }];
    this.registeredTokens = [...(networkParams.registeredTokens || [])];

  }

  public edit({ name, host, ledgerCanisterId }: EditNetworkParams) {
    this.name = name || this.name;
    this.host = host || this.host;
    this.ledgerCanisterId = ledgerCanisterId || this.ledgerCanisterId;
    this.onChange?.();
  }

  public getTokenInfo = async ({ canisterId, standard, agent }) => {
    if (!validateCanisterId(canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
    const tokenActor = await getTokenActor({ canisterId, standard, agent });
    const metadata = await tokenActor.getMetadata();
    if (!('fungible' in metadata)) {
      throw new Error(ERRORS.NON_FUNGIBLE_TOKEN_NOT_SUPPORTED);
    }
    const token = { ...metadata.fungible, canisterId, standard, registeredBy: [] };
    this.registeredTokens = uniqueTokens([...this.registeredTokens, token]);
    return token;
  }

  public registerToken = async ({ canisterId, standard, walletId, agent }: { canisterId: string, standard: string, walletId: number, agent: HttpAgent }) => {
    const token = this.registeredTokens.find(({ canisterId: id }) => id === canisterId);
    if (!token) {
      await this.getTokenInfo({ canisterId, standard, agent });
    }
    this.registeredTokens = this.registeredTokens.map(
      t => t.canisterId === canisterId ? { ...t, registeredBy: [...t?.registeredBy, walletId] } : t
    );
    await this.onChange?.();
    return this.registeredTokens;
  }

  public removeToken = async ({ canisterId }: { canisterId: string }): Promise<RegisteredToken[]> => {
    if (!this.registeredTokens.map(t => t.canisterId).includes(canisterId)) {
      return this.registeredTokens;
    }
    const newTokens = this.registeredTokens.filter(t => t.canisterId !== canisterId);
    this.registeredTokens = newTokens;
    await this.onChange?.();
    return newTokens;
  };

  public getTokens = (walletId) => {
    return [
      ...this.defaultTokens,
      ...this.registeredTokens.filter(t => t?.registeredBy?.includes(walletId)),
    ];
  }

  public toJSON(): Omit<NetworkParams, 'onChange'> {
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
  constructor({ registeredTokens, onChange }: { registeredTokens?: RegisteredToken[], onChange?: () => void }) {
    super({
      onChange,
      registeredTokens,
      name: 'Mainnet',
      host: `https://${IC_URL_HOST}`,
      ledgerCanisterId: TOKENS.ICP.canisterId,
    });
    this.id = 'mainnet';
    this.isCustom = false;
    this.defaultTokens = DEFAULT_MAINNET_TOKENS;
    this.registeredTokens = registeredTokens || [];
  }

  public edit(): void {
    return;
  }
}