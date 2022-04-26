
import type { Principal } from '@dfinity/principal';
export interface ICNSReverseRegistrar {
  'getName' : (arg_0: Principal) => Promise<string>,
  'setName' : (arg_0: string) => Promise<Result>,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export default interface _SERVICE extends ICNSReverseRegistrar {}