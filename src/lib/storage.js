/**
 * SiHiRi Decentralized Storage Module
 * 
 * This module provides utilities for storing and retrieving content using IPFS and Arweave.
 * It handles file uploads, metadata storage, and content addressing for the SiHiRi platform.
 */

import { create } from 'ipfs-http-client';
import config from '../config';

// Initialize IPFS client based on configuration
const initIPFSClient = () => {
  try {
    // Use Pinata API if credentials are provided
    if (config.storage.ipfs.pinningService === 'pinata' && 
        config.storage.ipfs.pinataApiKey && 
        config.storage.ipfs.pinataSecretKey) {
      return create({
        host: 'api.pinata.cloud',
        port: 443,
        protocol: 'https',
        headers: {
          pinata_api_key: config.storage.ipfs.pinataApiKey,
          pinata_secret_api_key: config.storage.ipfs.pinataSecretKey,
        },
      });
    }
    
    // Default to public IPFS gateway
    return create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });
  } catch (error) {
    console.error('Error initializing IPFS client:', error);
    return null;
  }
};

const ipfs = initIPFSClient();

/**
 * Upload a file to IPFS
 * @param {File|Blob} file - The file to upload
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
export const uploadToIPFS = async (file) => {
  if (!ipfs) {
    throw new Error('IPFS client not initialized');
  }
  
  try {
    const added = await ipfs.add(file, {
      progress: (prog) => console.log(`Upload progress: ${prog}`),
    });
    
    const cid = added.cid.toString();
    console.log('File uploaded to IPFS with CID:', cid);
    
    // If Arweave permanent storage is enabled, also store on Arweave
    if (config.storage.arweave.useArweaveForPermanentStorage) {
      try {
        await storeOnArweave(file, cid);
      } catch (arweaveError) {
        console.error('Failed to store on Arweave, but IPFS upload succeeded:', arweaveError);
      }
    }
    
    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

/**
 * Upload JSON metadata to IPFS
 * @param {Object} metadata - The metadata object to upload
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
export const uploadMetadataToIPFS = async (metadata) => {
  if (!ipfs) {
    throw new Error('IPFS client not initialized');
  }
  
  try {
    const metadataString = JSON.stringify(metadata);
    const metadataBuffer = Buffer.from(metadataString);
    
    const added = await ipfs.add(metadataBuffer);
    const cid = added.cid.toString();
    
    console.log('Metadata uploaded to IPFS with CID:', cid);
    return cid;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
};

/**
 * Get the IPFS gateway URL for a CID
 * @param {string} cid - The IPFS CID (Content Identifier)
 * @returns {string} - The full gateway URL
 */
export const getIPFSGatewayUrl = (cid) => {
  if (!cid) return '';
  
  // Remove ipfs:// prefix if present
  const cleanCid = cid.replace('ipfs://', '');
  
  return `${config.storage.ipfs.gateway}${cleanCid}`;
};

/**
 * Store a file on Arweave for permanent storage
 * @param {File|Blob} file - The file to store
 * @param {string} ipfsCid - The IPFS CID for reference
 * @returns {Promise<string>} - The Arweave transaction ID
 */
export const storeOnArweave = async (file, ipfsCid) => {
  // This is a placeholder for Arweave integration
  // In a real implementation, this would use the Arweave JS SDK
  console.log('Storing file on Arweave with IPFS reference:', ipfsCid);
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTxId = 'AR' + Math.random().toString(36).substring(2, 15);
      console.log('File stored on Arweave with transaction ID:', mockTxId);
      resolve(mockTxId);
    }, 1000);
  });
};

/**
 * Get the Arweave gateway URL for a transaction ID
 * @param {string} txId - The Arweave transaction ID
 * @returns {string} - The full gateway URL
 */
export const getArweaveGatewayUrl = (txId) => {
  if (!txId) return '';
  
  return `${config.storage.arweave.gateway}${txId}`;
};

/**
 * Create a full metadata object for an NFT
 * @param {Object} params - The parameters for the metadata
 * @returns {Object} - The complete metadata object
 */
export const createNFTMetadata = ({
  name,
  description,
  imageCid,
  animationCid = null,
  attributes = [],
  creator,
  mediaType,
  mediaSpecificData = {},
  components = [],
  license = 'CC-BY-4.0',
}) => {
  const metadata = {
    name,
    description,
    image: `ipfs://${imageCid}`,
    attributes,
    creator,
    media_type: mediaType,
    license,
    created_at: new Date().toISOString(),
    version: 1,
  };
  
  // Add animation URL if provided
  if (animationCid) {
    metadata.animation_url = `ipfs://${animationCid}`;
  }
  
  // Add media-specific data
  if (Object.keys(mediaSpecificData).length > 0) {
    metadata.media_specific = mediaSpecificData;
  }
  
  // Add components if provided
  if (components.length > 0) {
    metadata.components = components;
  }
  
  return metadata;
};

/**
 * Fetch metadata from IPFS
 * @param {string} cid - The IPFS CID of the metadata
 * @returns {Promise<Object>} - The metadata object
 */
export const fetchMetadataFromIPFS = async (cid) => {
  if (!cid) {
    throw new Error('CID is required');
  }
  
  // Remove ipfs:// prefix if present
  const cleanCid = cid.replace('ipfs://', '');
  
  try {
    const response = await fetch(`${config.storage.ipfs.gateway}${cleanCid}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata from IPFS:', error);
    throw error;
  }
};

/**
 * Check if a CID exists on IPFS
 * @param {string} cid - The IPFS CID to check
 * @returns {Promise<boolean>} - True if the CID exists
 */
export const checkIPFSAvailability = async (cid) => {
  if (!cid) return false;
  
  // Remove ipfs:// prefix if present
  const cleanCid = cid.replace('ipfs://', '');
  
  try {
    const response = await fetch(`${config.storage.ipfs.gateway}${cleanCid}`, {
      method: 'HEAD',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking IPFS availability:', error);
    return false;
  }
};

/**
 * Generate a metadata URL from a CID
 * @param {string} cid - The IPFS CID
 * @returns {string} - The metadata URL in ipfs:// format
 */
export const formatMetadataUrl = (cid) => {
  if (!cid) return '';
  
  // Remove ipfs:// prefix if present
  const cleanCid = cid.replace('ipfs://', '');
  
  return `ipfs://${cleanCid}`;
};

export default {
  uploadToIPFS,
  uploadMetadataToIPFS,
  getIPFSGatewayUrl,
  storeOnArweave,
  getArweaveGatewayUrl,
  createNFTMetadata,
  fetchMetadataFromIPFS,
  checkIPFSAvailability,
  formatMetadataUrl,
};