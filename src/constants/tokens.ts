export const TOKENS = {
  ICP: {
    symbol: 'ICP',
    canisterId: null,
    name: 'ICP',
    decimals: 5,
  },
  XTC: {
    symbol: 'XTC',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Cycles',
    decimals: 5,
  },
  WTC: {
    symbol: 'WTC',
    canisterId: '5ymop-yyaaa-aaaah-qaa4q-cai',
    name: 'Wrapped Cycles',
    decimals: 5,
  },
};

export const DEFAULT_TOKENS = [TOKENS.ICP, TOKENS.XTC];

export const DEFAULT_ASSETS = Object.values(DEFAULT_TOKENS).map(token => ({
  ...token,
  amount: BigInt(0),
}));
