import { ActorSubclass } from '@dfinity/agent';
import { ERRORS } from '../errors';

import TokenService from '../interfaces/token';
import { validateCanisterId } from '../PlugKeyRing/utils';

class Token {
  features: Array<string>;

  name: string;

  decimal: number;

  symbol: string;

  canisterId: string;

  private actor: ActorSubclass<TokenService>;

  constructor({ features, name, decimal, symbol, canisterId, actor }) {
    this.features = features;
    this.name = name;
    this.decimal = decimal;
    this.symbol = symbol;
    this.actor = actor;
    this.canisterId = canisterId;
    this.validateToken();
  }

  // public async balance(): number {}

  private validateToken(): void {
    if (!this.decimal || !this.name || !this.decimal) {
      throw new Error(ERRORS.TOKEN_NOT_SUPPORTED);
    }
    if (!validateCanisterId(this.canisterId)) {
      throw new Error(ERRORS.INVALID_CANISTER_ID);
    }
  }
}

export default Token;
