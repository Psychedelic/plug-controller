/* eslint-disable import/prefer-default-export */
export const ERRORS = {
  INVALID_MNEMONIC: 'The provided mnemonic is invalid',
  INVALID_ACC_ID: 'The account ID should be a positive integer',
  PASSWORD_REQUIRED: 'A password is required',
  NOT_INITIALIZED: 'Plug must be initialized',
  STATE_LOCKED: 'The state is locked',
  INVALID_WALLET_NUMBER: 'Invalid wallet number',
  GET_TRANSACTIONS_FAILS: 'Get transactions fails',
  INVALID_CANISTER_ID: 'The provided canister id is invalid',
  TOKEN_NOT_SUPPORTED:
    'The provided canister does not implement common extensions from EXT token interface. Please refer to "https://github.com/Toniq-Labs/extendable-token" for further information.',
  NON_FUNGIBLE_TOKEN_NOT_SUPPORTED: 'Non fungible tokens are not supported yet',
  TOKEN_NOT_SUPPORT_METADATA:
    'The provided canister does not implement commont extension',
  INVALID_PRINCIPAL_ID: 'Invalid principal id',
  GET_NFT_ERROR: 'Error while fetching NFT data',
  TRANSFER_NFT_ERROR:
    'Error while trying to transfer the NFT.\n Please verify that the NFT you are trying to transfer is not locked or listed for sale',
  INVALID_APP: 'Invalid app',
  ICNS_REVERSE_RESOLVER_ERROR: 'Error while interacting with ICNS reverse resolver',
  ICNS_REGISTRY_ERROR: 'Error while interacting with ICNS registry',
  ICNS_RESOLVER_ERROR: 'Error while interacting with ICNS resolver',
  INVALID_NETWORK_ID: 'Invalid network id',
  EMPTY_IDENTITY_ERROR: 'Identity or SecretKey missing',
  INVALID_TYPE_ERROR: 'No such type allowed',
  DELETE_ACCOUNT_ERROR: 'Only imported accounts could be deleted',
  TOKEN_NOT_REGISTERED: 'Token not registered',
  INVALID_ACCOUNT: 'The imported account already exists',
  NFT_ALREADY_REGISTERED: 'The NFT is already registered',
};

export const ERROR_CODES = {
  ADDED_ACCOUNT: 'added-account',
  INVALID_KEY: 'invalid-key',
};

