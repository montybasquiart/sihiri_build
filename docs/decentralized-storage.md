# Decentralized Storage Integration

## Overview

SiHiRi uses decentralized storage solutions to ensure that creative works are preserved permanently and remain accessible regardless of centralized server availability. This document outlines our approach to integrating with IPFS and Arweave for storing creative assets and metadata.

## Storage Solutions

### IPFS (InterPlanetary File System)

IPFS is a peer-to-peer hypermedia protocol designed to make the web faster, safer, and more open. In SiHiRi, we use IPFS for:

- Storing metadata for NFTs
- Temporary storage of creative assets
- Content addressing to ensure data integrity

#### Implementation Details

We use the `ipfs-http-client` library to interact with IPFS. The basic flow is:

1. User uploads a file through the SiHiRi interface
2. The file is added to IPFS, generating a Content Identifier (CID)
3. The CID is stored in the NFT metadata
4. The file can be accessed via IPFS gateways using the CID

```javascript
import { create } from 'ipfs-http-client';

// Connect to an IPFS node
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

// Upload a file to IPFS
async function uploadToIPFS(file) {
  try {
    const added = await ipfs.add(file);
    const cid = added.cid.toString();
    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}
```

### Arweave

Arweave is a decentralized storage network that aims to provide permanent data storage. Unlike IPFS, Arweave has built-in economic incentives for long-term storage. In SiHiRi, we use Arweave for:

- Permanent storage of high-value creative assets
- Long-term preservation of cultural works
- Immutable storage of provenance records

#### Implementation Details

We use the `arweave-js` library to interact with the Arweave network. The basic flow is:

1. User chooses to permanently store an asset on Arweave
2. The file is uploaded to Arweave, generating a transaction ID
3. The transaction ID is stored in the NFT metadata
4. The file can be accessed via Arweave gateways using the transaction ID

```javascript
import Arweave from 'arweave';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Upload a file to Arweave
async function uploadToArweave(file, wallet) {
  try {
    // Create a transaction
    const transaction = await arweave.createTransaction({ data: file }, wallet);
    
    // Add tags for easier discovery
    transaction.addTag('Content-Type', file.type);
    transaction.addTag('App-Name', 'SiHiRi');
    
    // Sign and submit the transaction
    await arweave.transactions.sign(transaction, wallet);
    const response = await arweave.transactions.post(transaction);
    
    if (response.status === 200) {
      return transaction.id;
    } else {
      throw new Error(`Transaction failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error uploading to Arweave:', error);
    throw error;
  }
}
```

## Hybrid Approach

SiHiRi implements a hybrid storage approach to balance cost, performance, and permanence:

1. **Initial Storage**: When a creator first uploads a work, it's stored on IPFS for immediate availability and lower cost.

2. **Permanence Options**: Creators can choose to permanently store their work on Arweave, either:
   - At creation time (for important works)
   - After a work gains recognition or value
   - When a work is sold or transferred

3. **Metadata Strategy**: All metadata is stored on both IPFS and Arweave to ensure the descriptive information about the work is always available.

## Content Addressing and Retrieval

SiHiRi uses content addressing to ensure that assets can be retrieved regardless of where they are physically stored:

```javascript
// Function to generate a URI for a creative asset
function generateAssetURI(asset) {
  if (asset.arweaveId) {
    return `ar://${asset.arweaveId}`;
  } else if (asset.ipfsCid) {
    return `ipfs://${asset.ipfsCid}`;
  } else {
    throw new Error('No valid storage identifier found');
  }
}

// Function to retrieve an asset from its URI
async function retrieveAsset(uri) {
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    return fetchFromIPFS(cid);
  } else if (uri.startsWith('ar://')) {
    const txId = uri.replace('ar://', '');
    return fetchFromArweave(txId);
  } else {
    throw new Error('Unsupported URI scheme');
  }
}
```

## Gateway Strategy

To ensure reliable access to decentralized storage, SiHiRi implements a multi-gateway strategy:

1. **Primary Gateways**: Default gateways for IPFS and Arweave access
2. **Fallback Gateways**: Alternative gateways if primary gateways are unavailable
3. **Self-hosted Gateway**: For premium users or organizations, SiHiRi can connect to self-hosted IPFS nodes

```javascript
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.ipfs.io/ipfs/'
];

const ARWEAVE_GATEWAYS = [
  'https://arweave.net/',
  'https://arweave.dev/'
];

// Function to try multiple gateways until content is retrieved
async function retrieveWithFallback(identifier, gateways) {
  for (const gateway of gateways) {
    try {
      const response = await fetch(`${gateway}${identifier}`);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.warn(`Gateway ${gateway} failed, trying next...`);
    }
  }
  throw new Error('All gateways failed');
}
```

## Future Enhancements

1. **Filecoin Integration**: For additional storage redundancy and different economic incentives
2. **Ceramic Network**: For mutable metadata that maintains verifiable history
3. **Storage DAOs**: Community-governed storage pools for cultural preservation
4. **Content-Specific Optimization**: Different storage strategies based on media type (e.g., video vs. image)

## Best Practices for Creators

1. **File Formats**: Use open, standardized file formats when possible
2. **Metadata Completeness**: Include comprehensive metadata to ensure future discoverability
3. **Backup Strategy**: Consider using multiple storage solutions for important works
4. **Size Optimization**: Optimize file sizes while maintaining quality

## Implementation Roadmap

### Phase 1 (Current)
- Basic IPFS integration for all creative assets
- Metadata storage on IPFS
- Multi-gateway access strategy

### Phase 2
- Arweave integration for permanent storage
- Hybrid storage policies
- Storage cost estimation tools

### Phase 3
- Additional storage networks (Filecoin, Ceramic)
- Storage DAOs for community-governed preservation
- Advanced content addressing with semantic search