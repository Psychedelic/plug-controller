export type StandardFeature = 'history' | 'dex' | 'burnable';
export default interface StandardToken {
  name: string;
  symbol: string;
  decimal: number;
  // List of the extensions this token implements.
  features: Array<StandardFeature> | [];
}
