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
    standard: 'xtc',
  },
  WTC: {
    symbol: 'WTC',
    canisterId: '5ymop-yyaaa-aaaah-qaa4q-cai',
    name: 'Wrapped Cycles',
    decimals: 5,
    standard: 'ext',
  },
  WICP: {
    symbol: 'WICP',
    canisterId: 'utozz-siaaa-aaaam-qaaxq-cai',
    name: 'Wrapped ICP',
    decimals: 8,
    standard: 'wicp'
  },
  BTKN: {
    symbol: 'BTKN',
    canisterId: 'cfoim-fqaaa-aaaai-qbcmq-cai',
    name: 'Beta Token',
    decimals: 8,
    standard: 'dip20'
  },
  WXTC: {
    symbol: 'WXTC',
    canisterId: 'cfoim-fqaaa-aaaai-qbcmq-cai', // TODO: CHANGE CANISTERID
    name: 'Wrapped XTC',
    decimals: 8,
    standard: 'dip20'
  },
  DUST: {
    symbol: 'DUST',
    canisterId: 'cfoim-fqaaa-aaaai-qbcmq-cai', // TODO: CHANGE CANISTERID
    name: 'Dust Token',
    decimals: 8,
    standard: 'dip20'
  },
};

export const DEFAULT_TOKENS = [TOKENS.ICP, TOKENS.XTC, TOKENS.WICP];

export const DEFAULT_CUSTOM_TOKENS = [TOKENS.XTC, TOKENS.WICP];

export const DEFAULT_ASSETS = Object.values(DEFAULT_TOKENS).map(token => ({
  ...token,
  amount: '0',
}));
