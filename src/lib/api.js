import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
  callReadOnlyFunction,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  NonFungibleConditionCode,
  makeStandardNonFungiblePostCondition,
  createAssetInfo,
  standardPrincipalCV,
  contractPrincipalCV,
  uintCV,
  stringUtf8CV,
  listCV,
  someCV,
  noneCV,
  tupleCV,
  trueCV,
  falseCV,
  cvToHex,
} from '@stacks/transactions';
import { UserSession, openContractCall } from '@stacks/connect';

// Set network (testnet for development, change to StacksMainnet for production)
const network = new StacksTestnet();

// Contract addresses
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with actual contract deployer address
const NFT_CONTRACT_NAME = 'nft-ownership';
const IDENTITY_CONTRACT_NAME = 'identity';
const ROYALTY_CONTRACT_NAME = 'royalty';
const MARKETPLACE_CONTRACT_NAME = 'marketplace';

/**
 * NFT Contract Functions
 */

// Get token info
export async function getTokenInfo(tokenId, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: NFT_CONTRACT_NAME,
    functionName: 'get-token-info',
    functionArgs: [uintCV(tokenId)],
    network,
    senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
  };

  const result = await callReadOnlyFunction(options);
  return result.value;
}

// Get token owner
export async function getTokenOwner(tokenId, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: NFT_CONTRACT_NAME,
    functionName: 'get-token-owner',
    functionArgs: [uintCV(tokenId)],
    network,
    senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
  };

  const result = await callReadOnlyFunction(options);
  return result.value;
}

// Mint a new NFT
export async function mintNFT(metadataUrl, royaltyPercent, isTransferable, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: NFT_CONTRACT_NAME,
    functionName: 'mint',
    functionArgs: [
      stringUtf8CV(metadataUrl),
      uintCV(royaltyPercent),
      isTransferable ? trueCV() : falseCV(),
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: 0, // Allow any post conditions
    onFinish: data => {
      console.log('Transaction:', data);
      return data;
    },
    onCancel: () => {
      console.log('Transaction canceled');
    },
  };

  await openContractCall(options);
}

// Transfer an NFT
export async function transferNFT(tokenId, recipient, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: NFT_CONTRACT_NAME,
    functionName: 'transfer',
    functionArgs: [
      uintCV(tokenId),
      standardPrincipalCV(recipient),
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: 0, // Allow any post conditions
    onFinish: data => {
      console.log('Transaction:', data);
      return data;
    },
    onCancel: () => {
      console.log('Transaction canceled');
    },
  };

  await openContractCall(options);
}

/**
 * Identity Contract Functions
 */

// Get creator profile
export async function getCreatorProfile(principal, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: IDENTITY_CONTRACT_NAME,
    functionName: 'get-profile',
    functionArgs: [standardPrincipalCV(principal)],
    network,
    senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
  };

  const result = await callReadOnlyFunction(options);
  return result.value;
}

// Register a new creator profile
export async function registerProfile(
  username,
  displayName,
  bio,
  avatarUrl,
  website,
  socialLinks,
  creationCategories,
  userSession
) {
  // Convert social links to CV format
  const socialLinksCV = listCV(
    socialLinks.map(link =>
      tupleCV({
        platform: stringUtf8CV(link.platform),
        url: stringUtf8CV(link.url),
      })
    )
  );

  // Convert creation categories to CV format
  const categoriesCV = listCV(
    creationCategories.map(category => stringUtf8CV(category))
  );

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: IDENTITY_CONTRACT_NAME,
    functionName: 'register-profile',
    functionArgs: [
      stringUtf8CV(username),
      stringUtf8CV(displayName),
      stringUtf8CV(bio),
      stringUtf8CV(avatarUrl),
      stringUtf8CV(website),
      socialLinksCV,
      categoriesCV,
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: 0, // Allow any post conditions
    onFinish: data => {
      console.log('Transaction:', data);
      return data;
    },
    onCancel: () => {
      console.log('Transaction canceled');
    },
  };

  await openContractCall(options);
}

/**
 * Marketplace Contract Functions
 */

// Get listing details
export async function getListing(listingId, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: MARKETPLACE_CONTRACT_NAME,
    functionName: 'get-listing',
    functionArgs: [uintCV(listingId)],
    network,
    senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
  };

  const result = await callReadOnlyFunction(options);
  return result.value;
}

// Create a listing
export async function createListing(tokenId, price, expiry, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: MARKETPLACE_CONTRACT_NAME,
    functionName: 'create-listing',
    functionArgs: [
      contractPrincipalCV(CONTRACT_ADDRESS, NFT_CONTRACT_NAME),
      uintCV(tokenId),
      uintCV(price),
      uintCV(expiry),
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: 0, // Allow any post conditions
    onFinish: data => {
      console.log('Transaction:', data);
      return data;
    },
    onCancel: () => {
      console.log('Transaction canceled');
    },
  };

  await openContractCall(options);
}

// Buy a listing
export async function buyListing(listingId, price, userSession) {
  // Create post condition to ensure we don't spend more than expected
  const postConditions = [
    makeStandardSTXPostCondition(
      userSession.loadUserData().profile.stxAddress.testnet,
      FungibleConditionCode.LessEqual,
      price
    ),
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: MARKETPLACE_CONTRACT_NAME,
    functionName: 'buy-listing',
    functionArgs: [
      uintCV(listingId),
      contractPrincipalCV(CONTRACT_ADDRESS, NFT_CONTRACT_NAME),
      contractPrincipalCV(CONTRACT_ADDRESS, ROYALTY_CONTRACT_NAME),
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditions,
    postConditionMode: 1, // Require post conditions
    onFinish: data => {
      console.log('Transaction:', data);
      return data;
    },
    onCancel: () => {
      console.log('Transaction canceled');
    },
  };

  await openContractCall(options);
}

/**
 * Royalty Contract Functions
 */

// Get creator earnings
export async function getCreatorEarnings(creator, userSession) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: ROYALTY_CONTRACT_NAME,
    functionName: 'get-creator-earnings',
    functionArgs: [standardPrincipalCV(creator)],
    network,
    senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
  };

  const result = await callReadOnlyFunction(options);
  return result.value;
}

// Direct payment to a creator
export async function directPayment(recipient, amount, paymentType, context, userSession) {
  // Create post condition to ensure we don't spend more than expected
  const postConditions = [
    makeStandardSTXPostCondition(
      userSession.loadUserData().profile.stxAddress.testnet,
      FungibleConditionCode.LessEqual,
      amount
    ),
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: ROYALTY_CONTRACT_NAME,
    functionName: 'direct-payment',
    functionArgs: [
      standardPrincipalCV(recipient),
      uintCV(amount),
      stringUtf8CV(paymentType),
      stringUtf8CV(context),
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditions,
    postConditionMode: 1, // Require post conditions
    onFinish: data => {
      console.log('Transaction:', data);
      return data;
    },
    onCancel: () => {
      console.log('Transaction canceled');
    },
  };

  await openContractCall(options);
}

/**
 * Utility Functions
 */

// Upload metadata to IPFS (placeholder - would need actual IPFS integration)
export async function uploadToIPFS(metadata, file) {
  // This is a placeholder for actual IPFS integration
  // In a real implementation, you would:
  // 1. Upload the file to IPFS
  // 2. Get the IPFS hash/CID
  // 3. Create metadata JSON with the file reference
  // 4. Upload the metadata JSON to IPFS
  // 5. Return the metadata CID
  
  console.log('Uploading to IPFS:', metadata, file);
  
  // Mock response - in reality this would be the IPFS CID of the metadata
  return `ipfs://QmExample${Math.floor(Math.random() * 1000000)}`;
}

// Format blockchain data for UI display
export function formatBlockchainData(data) {
  // Helper function to format data from the blockchain for UI display
  // This would handle conversion of CV types to JavaScript types
  return data;
}