import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { Person } from '@stacks/profile';

/**
 * SiHiRi Authentication Module
 * 
 * This module provides authentication functionality for the SiHiRi platform
 * using Stacks blockchain authentication.
 */

// Configure the app
const appConfig = new AppConfig(['store_write', 'publish_data']);

// Initialize the user session
export const userSession = new UserSession({ appConfig });

/**
 * Authenticate the user with their Stacks wallet
 * @param {Function} callback - Function to call after successful authentication
 */
export const authenticate = (callback) => {
  showConnect({
    appDetails: {
      name: 'SiHiRi',
      icon: '/assets/sihiri-logo.svg',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
      if (callback) callback();
    },
    userSession,
  });
};

/**
 * Get the user's profile information
 * @returns {Object|null} The user's profile or null if not authenticated
 */
export const getUserProfile = () => {
  if (!userSession.isUserSignedIn()) {
    return null;
  }

  const userData = userSession.loadUserData();
  const person = new Person(userData.profile);
  
  return {
    stxAddress: userData.profile.stxAddress.mainnet,
    testnetAddress: userData.profile.stxAddress.testnet,
    name: person.name() || 'Anonymous Creator',
    avatarUrl: person.avatarUrl() || '/assets/default-avatar.png',
    username: userData.username || '',
  };
};

/**
 * Check if the user is authenticated
 * @returns {Boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return userSession.isUserSignedIn();
};

/**
 * Sign the user out
 */
export const signOut = () => {
  userSession.signUserOut();
  window.location.href = '/';
};

/**
 * Get the user's Stacks address for the current network
 * @param {String} network - The network to get the address for ('mainnet' or 'testnet')
 * @returns {String|null} The user's Stacks address or null if not authenticated
 */
export const getUserAddress = (network = 'mainnet') => {
  if (!userSession.isUserSignedIn()) {
    return null;
  }

  const userData = userSession.loadUserData();
  return userData.profile.stxAddress[network];
};

/**
 * Get authentication token for API requests
 * @returns {String|null} The authentication token or null if not authenticated
 */
export const getAuthToken = () => {
  if (!userSession.isUserSignedIn()) {
    return null;
  }

  return userSession.loadUserData().authResponseToken;
};

/**
 * Check if the current user owns a specific NFT
 * @param {String} tokenId - The ID of the NFT to check
 * @param {Function} contractCall - Function to call the contract
 * @returns {Promise<Boolean>} Promise that resolves to true if the user owns the NFT
 */
export const checkNftOwnership = async (tokenId, contractCall) => {
  if (!userSession.isUserSignedIn()) {
    return false;
  }

  const address = getUserAddress();
  try {
    const result = await contractCall({
      contractName: 'nft-ownership',
      functionName: 'get-owner',
      functionArgs: [tokenId],
    });
    
    return result === address;
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return false;
  }
};

/**
 * Initialize the authentication system
 * This should be called when the app starts
 */
export const initAuth = () => {
  if (userSession.isSignInPending()) {
    userSession.handlePendingSignIn().then(() => {
      window.location.reload();
    });
  }
};