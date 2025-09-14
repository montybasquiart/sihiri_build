/**
 * SiHiRi Configuration
 * 
 * This file contains the core configuration settings for the SiHiRi platform.
 * It includes network settings, contract addresses, and environment-specific configurations.
 */

// Network configurations
const networks = {
  mainnet: {
    stacksApiUrl: 'https://stacks-node-api.mainnet.stacks.co',
    stacksExplorerUrl: 'https://explorer.stacks.co',
    networkId: 1, // mainnet
  },
  testnet: {
    stacksApiUrl: 'https://stacks-node-api.testnet.stacks.co',
    stacksExplorerUrl: 'https://explorer.testnet.stacks.co',
    networkId: 2147483648, // testnet
  },
  local: {
    stacksApiUrl: 'http://localhost:3999',
    stacksExplorerUrl: 'http://localhost:8000',
    networkId: 2147483648, // same as testnet
  },
};

// Default network based on environment
const defaultNetwork = process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';

// Contract addresses
const contracts = {
  mainnet: {
    nftOwnership: '', // To be deployed
    identity: '', // To be deployed
    royalty: '', // To be deployed
    marketplace: '', // To be deployed
  },
  testnet: {
    nftOwnership: '', // To be deployed
    identity: '', // To be deployed
    royalty: '', // To be deployed
    marketplace: '', // To be deployed
  },
  local: {
    nftOwnership: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-ownership',
    identity: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.identity',
    royalty: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.royalty',
    marketplace: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.marketplace',
  },
};

// Decentralized storage configuration
const storage = {
  ipfs: {
    gateway: 'https://ipfs.io/ipfs/',
    pinningService: 'pinata', // Options: 'pinata', 'web3.storage', 'nft.storage'
    pinataApiKey: process.env.PINATA_API_KEY || '',
    pinataSecretKey: process.env.PINATA_SECRET_KEY || '',
  },
  arweave: {
    gateway: 'https://arweave.net/',
    useArweaveForPermanentStorage: true,
  },
};

// UI configuration
const ui = {
  theme: {
    primaryColor: '#6200EA', // Deep purple
    secondaryColor: '#03DAC6', // Teal
    accentColor: '#FF9100', // Orange
    backgroundColor: '#FFFFFF',
    textColor: '#212121',
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
  },
  features: {
    enableAIAssistant: false, // Phase 3 feature
    enableCrossChainBridges: false, // Phase 2 feature
    enableDynamicRoyalties: false, // Phase 2 feature
    enableDAO: false, // Phase 2 feature
    enableMicroPatronage: false, // Phase 2 feature
  },
};

// API endpoints
const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  endpoints: {
    nft: '/nft',
    user: '/user',
    marketplace: '/marketplace',
    storage: '/storage',
    royalties: '/royalties',
  },
};

// Feature flags for development
const featureFlags = {
  enableExperimentalFeatures: process.env.ENABLE_EXPERIMENTAL_FEATURES === 'true',
  debugMode: process.env.DEBUG_MODE === 'true',
  mockBlockchainCalls: process.env.MOCK_BLOCKCHAIN_CALLS === 'true',
};

// Export the configuration
const config = {
  networks,
  defaultNetwork,
  contracts,
  storage,
  ui,
  api,
  featureFlags,
  // Helper function to get current network configuration
  getCurrentNetwork: () => {
    const networkName = process.env.NEXT_PUBLIC_NETWORK || defaultNetwork;
    return {
      name: networkName,
      ...networks[networkName],
      contracts: contracts[networkName],
    };
  },
};

export default config;