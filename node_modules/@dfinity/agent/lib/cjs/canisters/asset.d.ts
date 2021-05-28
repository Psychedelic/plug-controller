import { ActorConfig, ActorSubclass } from '../actor';
export interface AssetCanisterRecord {
    store(path: string, content: number[]): Promise<void>;
    retrieve(path: string): Promise<number[]>;
}
/**
 * Create a management canister actor.
 * @param config
 */
export declare function createAssetCanisterActor(config: ActorConfig): ActorSubclass<AssetCanisterRecord>;
