/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import type { Principal } from '@dfinity/principal';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ICNSReverseRegistrar {
  'getName' : (arg_0: Principal) => Promise<string>,
  'setName' : (arg_0: string) => Promise<Result>,
}
export type Result = { 'ok' : string } |
  { 'err' : string };

export default interface _SERVICE extends ICNSReverseRegistrar {}