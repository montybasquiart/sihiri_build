/**
 * SiHiRi Smart Contract Interaction Module
 * 
 * This module provides utilities for interacting with the Clarity smart contracts
 * that power the SiHiRi platform.
 */

import {
  callReadOnlyFunction,
  contractPrincipalCV,
  cvToValue,
  noneCV,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import config from '../config';
import { getUserAddress } from './auth';

// Get the current network configuration
const getCurrentNetwork = () => {
  const networkName = process.env.NEXT_PUBLIC_NETWORK || config.defaultNetwork;
  
  if (networkName === 'mainnet') {
    return new StacksMainnet();
  } else if (networkName === 'testnet') {
    return new StacksTestnet();
  } else {
    // Local network
    return new StacksTestnet({ url: config.networks.local.stacksApiUrl });
  }
};

// Get the contract address and name for a given contract
const getContractInfo = (contractName) => {
  const networkName = process.env.NEXT_PUBLIC_NETWORK || config.defaultNetwork;
  const contractFullName = config.contracts[networkName][contractName];
  
  if (!contractFullName) {
    throw new Error(`Contract ${contractName} not found in config for network ${networkName}`);
  }
  
  const [contractAddress, name] = contractFullName.split('.');
  return { contractAddress, contractName: name };
};

/**
 * Call a read-only function on a smart contract
 * @param {Object} params - The parameters for the function call
 * @returns {Promise<any>} - The result of the function call
 */
export const callContractReadOnly = async ({
  contractName,
  functionName,
  functionArgs = [],
  senderAddress = null,
}) => {
  try {
    const network = getCurrentNetwork();
    const { contractAddress, contractName: name } = getContractInfo(contractName);
    const sender = senderAddress || getUserAddress() || contractAddress;
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: name,
      functionName,
      functionArgs,
      senderAddress: sender,
      network,
    });
    
    return cvToValue(result);
  } catch (error) {
    console.error(`Error calling ${contractName}.${functionName}:`, error);
    throw error;
  }
};

/**
 * NFT Ownership Contract Functions
 */
export const nftContract = {
  /**
   * Get the owner of an NFT
   * @param {number} tokenId - The ID of the NFT
   * @returns {Promise<string>} - The principal of the owner
   */
  getOwner: async (tokenId) => {
    return callContractReadOnly({
      contractName: 'nftOwnership',
      functionName: 'get-owner',
      functionArgs: [uintCV(tokenId)],
    });
  },
  
  /**
   * Get the metadata URL of an NFT
   * @param {number} tokenId - The ID of the NFT
   * @returns {Promise<string>} - The metadata URL
   */
  getMetadataUrl: async (tokenId) => {
    return callContractReadOnly({
      contractName: 'nftOwnership',
      functionName: 'get-token-uri',
      functionArgs: [uintCV(tokenId)],
    });
  },
  
  /**
   * Get the creator of an NFT
   * @param {number} tokenId - The ID of the NFT
   * @returns {Promise<string>} - The principal of the creator
   */
  getCreator: async (tokenId) => {
    return callContractReadOnly({
      contractName: 'nftOwnership',
      functionName: 'get-creator',
      functionArgs: [uintCV(tokenId)],
    });
  },
  
  /**
   * Get the royalty percentage for an NFT
   * @param {number} tokenId - The ID of the NFT
   * @returns {Promise<number>} - The royalty percentage
   */
  getRoyaltyPercent: async (tokenId) => {
    return callContractReadOnly({
      contractName: 'nftOwnership',
      functionName: 'get-royalty-percent',
      functionArgs: [uintCV(tokenId)],
    });
  },
  
  /**
   * Check if an NFT is transferable
   * @param {number} tokenId - The ID of the NFT
   * @returns {Promise<boolean>} - True if the NFT is transferable
   */
  isTransferable: async (tokenId) => {
    return callContractReadOnly({
      contractName: 'nftOwnership',
      functionName: 'is-transferable',
      functionArgs: [uintCV(tokenId)],
    });
  },
  
  /**
   * Get the total supply of NFTs
   * @returns {Promise<number>} - The total supply
   */
  getTotalSupply: async () => {
    return callContractReadOnly({
      contractName: 'nftOwnership',
      functionName: 'get-last-token-id',
      functionArgs: [],
    });
  },
  
  /**
   * Get the NFTs owned by a principal
   * @param {string} owner - The principal of the owner
   * @returns {Promise<number[]>} - Array of token IDs
   */
  getTokensByOwner: async (owner) => {
    return callContractReadOnly({
      contractName: 'nftOwnership',
      functionName: 'get-tokens-by-owner',
      functionArgs: [standardPrincipalCV(owner)],
    });
  },
};

/**
 * Identity Contract Functions
 */
export const identityContract = {
  /**
   * Get a creator's profile
   * @param {string} principal - The principal of the creator
   * @returns {Promise<Object>} - The creator's profile
   */
  getProfile: async (principal) => {
    return callContractReadOnly({
      contractName: 'identity',
      functionName: 'get-profile',
      functionArgs: [standardPrincipalCV(principal)],
    });
  },
  
  /**
   * Check if a username is available
   * @param {string} username - The username to check
   * @returns {Promise<boolean>} - True if the username is available
   */
  isUsernameAvailable: async (username) => {
    return callContractReadOnly({
      contractName: 'identity',
      functionName: 'is-username-available',
      functionArgs: [stringAsciiCV(username)],
    });
  },
  
  /**
   * Get a principal by username
   * @param {string} username - The username to look up
   * @returns {Promise<string>} - The principal associated with the username
   */
  getPrincipalByUsername: async (username) => {
    return callContractReadOnly({
      contractName: 'identity',
      functionName: 'get-principal-by-username',
      functionArgs: [stringAsciiCV(username)],
    });
  },
  
  /**
   * Check if a creator is verified
   * @param {string} principal - The principal of the creator
   * @returns {Promise<boolean>} - True if the creator is verified
   */
  isCreatorVerified: async (principal) => {
    return callContractReadOnly({
      contractName: 'identity',
      functionName: 'is-verified',
      functionArgs: [standardPrincipalCV(principal)],
    });
  },
};

/**
 * Marketplace Contract Functions
 */
export const marketplaceContract = {
  /**
   * Get a listing by ID
   * @param {number} listingId - The ID of the listing
   * @returns {Promise<Object>} - The listing details
   */
  getListing: async (listingId) => {
    return callContractReadOnly({
      contractName: 'marketplace',
      functionName: 'get-listing',
      functionArgs: [uintCV(listingId)],
    });
  },
  
  /**
   * Get an auction by ID
   * @param {number} auctionId - The ID of the auction
   * @returns {Promise<Object>} - The auction details
   */
  getAuction: async (auctionId) => {
    return callContractReadOnly({
      contractName: 'marketplace',
      functionName: 'get-auction',
      functionArgs: [uintCV(auctionId)],
    });
  },
  
  /**
   * Get the highest bid for an auction
   * @param {number} auctionId - The ID of the auction
   * @returns {Promise<Object>} - The highest bid details
   */
  getHighestBid: async (auctionId) => {
    return callContractReadOnly({
      contractName: 'marketplace',
      functionName: 'get-highest-bid',
      functionArgs: [uintCV(auctionId)],
    });
  },
  
  /**
   * Get all listings by a seller
   * @param {string} seller - The principal of the seller
   * @returns {Promise<number[]>} - Array of listing IDs
   */
  getListingsBySeller: async (seller) => {
    return callContractReadOnly({
      contractName: 'marketplace',
      functionName: 'get-listings-by-seller',
      functionArgs: [standardPrincipalCV(seller)],
    });
  },
  
  /**
   * Get all auctions by a seller
   * @param {string} seller - The principal of the seller
   * @returns {Promise<number[]>} - Array of auction IDs
   */
  getAuctionsBySeller: async (seller) => {
    return callContractReadOnly({
      contractName: 'marketplace',
      functionName: 'get-auctions-by-seller',
      functionArgs: [standardPrincipalCV(seller)],
    });
  },
  
  /**
   * Check if a token is listed in the marketplace
   * @param {number} tokenId - The ID of the NFT
   * @returns {Promise<boolean>} - True if the token is listed
   */
  isTokenListed: async (tokenId) => {
    return callContractReadOnly({
      contractName: 'marketplace',
      functionName: 'is-token-listed',
      functionArgs: [uintCV(tokenId)],
    });
  },
};

/**
 * Royalty Contract Functions
 */
export const royaltyContract = {
  /**
   * Get the last payment ID
   * @returns {Promise<number>} - The last payment ID
   */
  getLastPaymentId: async () => {
    return callContractReadOnly({
      contractName: 'royalty',
      functionName: 'get-last-payment-id',
      functionArgs: [],
    });
  },
  
  /**
   * Get payment details
   * @param {number} paymentId - The ID of the payment
   * @returns {Promise<Object>} - The payment details
   */
  getPaymentDetails: async (paymentId) => {
    return callContractReadOnly({
      contractName: 'royalty',
      functionName: 'get-payment-details',
      functionArgs: [uintCV(paymentId)],
    });
  },
  
  /**
   * Get a creator's total earnings
   * @param {string} creator - The principal of the creator
   * @returns {Promise<number>} - The total earnings
   */
  getCreatorEarnings: async (creator) => {
    return callContractReadOnly({
      contractName: 'royalty',
      functionName: 'get-creator-earnings',
      functionArgs: [standardPrincipalCV(creator)],
    });
  },
  
  /**
   * Get a creator's earnings for a specific token
   * @param {string} creator - The principal of the creator
   * @param {number} tokenId - The ID of the NFT
   * @returns {Promise<number>} - The earnings for the token
   */
  getCreatorTokenEarnings: async (creator, tokenId) => {
    return callContractReadOnly({
      contractName: 'royalty',
      functionName: 'get-creator-token-earnings',
      functionArgs: [standardPrincipalCV(creator), uintCV(tokenId)],
    });
  },
};

export default {
  callContractReadOnly,
  nftContract,
  identityContract,
  marketplaceContract,
  royaltyContract,
};