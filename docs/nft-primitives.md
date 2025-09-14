# NFT Primitives Architecture

## Overview

SiHiRi's NFT primitives are designed to support a wide range of creative works, including art, music, film, and interactive media. Our architecture extends beyond basic NFT functionality to include dynamic metadata, royalty management, and collaborative ownership models.

## Core NFT Structure

The SiHiRi NFT architecture is built on Clarity smart contracts and includes the following core components:

### 1. Base NFT Properties

```clarity
(define-map tokens
  { token-id: uint }
  {
    owner: principal,
    creator: principal,
    metadata-url: (string-utf8 256),
    royalty-percent: uint,
    is-transferable: bool,
    creation-time: uint
  }
)
```

These properties provide the foundation for all creative works in the SiHiRi ecosystem:

- **owner**: Current owner of the NFT
- **creator**: Original creator of the work
- **metadata-url**: Link to the work's metadata (stored on IPFS/Arweave)
- **royalty-percent**: Percentage of sales that go to royalty recipients
- **is-transferable**: Whether the NFT can be transferred
- **creation-time**: Block height when the NFT was created

### 2. Dynamic Metadata

Unlike traditional NFTs with static metadata, SiHiRi NFTs support dynamic metadata that can evolve over time:

```json
{
  "name": "Digital Dreamscape",
  "description": "An evolving digital landscape that changes with the seasons",
  "image": "ipfs://QmExample123",
  "animation_url": "ipfs://QmExample456",
  "attributes": [
    {
      "trait_type": "Medium",
      "value": "Digital Painting"
    },
    {
      "trait_type": "Style",
      "value": "Abstract"
    }
  ],
  "content": {
    "mime_type": "image/png",
    "size_bytes": 2048576,
    "resolution": "3840x2160",
    "color_space": "sRGB"
  },
  "version": 1,
  "updated_at": "2023-04-15T12:00:00Z",
  "components": [
    {
      "name": "Background",
      "creator": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "asset_url": "ipfs://QmExample789"
    },
    {
      "name": "Character",
      "creator": "ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "asset_url": "ipfs://QmExampleABC"
    }
  ],
  "license": "CC-BY-SA-4.0",
  "external_url": "https://sihiri.org/works/digital-dreamscape"
}
```

Key features of our dynamic metadata:

- **Components**: Individual elements that make up the work, with attribution to different creators
- **Version tracking**: History of changes to the work
- **Technical specifications**: Detailed information about the content format
- **License information**: Clear rights management

### 3. Royalty Distribution

SiHiRi NFTs include sophisticated royalty management:

```clarity
(define-map royalty-recipients
  { token-id: uint }
  {
    primary-recipient: principal,
    secondary-recipients: (list 5 {
      recipient: principal,
      share-percent: uint
    })
  }
)
```

This structure allows for:

- Primary royalty recipient (usually the creator)
- Multiple secondary recipients with percentage-based splits
- Automatic distribution of royalties on sales

## Media-Specific Extensions

SiHiRi NFTs are extended with media-specific properties to support different creative formats:

### Visual Art Extensions

```json
{
  "art_specific": {
    "medium": "Digital Painting",
    "dimensions": "3840x2160 px",
    "materials": ["Procreate", "Adobe Photoshop"],
    "editions": 1,
    "authenticity": {
      "signature": "ipfs://QmExampleDEF",
      "certificate": "ipfs://QmExampleGHI"
    }
  }
}
```

### Music Extensions

```json
{
  "music_specific": {
    "duration": "3:42",
    "bpm": 120,
    "key": "C Minor",
    "genres": ["Electronic", "Ambient"],
    "stems": {
      "vocals": "ipfs://QmExampleJKL",
      "drums": "ipfs://QmExampleMNO",
      "bass": "ipfs://QmExamplePQR",
      "synths": "ipfs://QmExampleSTU"
    },
    "lyrics": "ipfs://QmExampleVWX",
    "isrc": "USRC17607839"
  }
}
```

### Film/Video Extensions

```json
{
  "film_specific": {
    "duration": "12:34",
    "resolution": "4K",
    "aspect_ratio": "16:9",
    "director": "ST3PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "cinematographer": "ST4PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "editor": "ST5PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "cast": ["Character 1", "Character 2"],
    "screenplay": "ipfs://QmExampleYZ1",
    "storyboard": "ipfs://QmExample234"
  }
}
```

### Interactive Media Extensions

```json
{
  "interactive_specific": {
    "platform": "WebGL",
    "controls": ["Keyboard", "Mouse"],
    "dimensions": "3D",
    "engine": "Unity",
    "source_code": "ipfs://QmExample567",
    "assets": {
      "models": ["ipfs://QmExample890", "ipfs://QmExampleABC"],
      "textures": ["ipfs://QmExampleDEF", "ipfs://QmExampleGHI"],
      "audio": ["ipfs://QmExampleJKL", "ipfs://QmExampleMNO"]
    },
    "system_requirements": {
      "minimum": "WebGL 2.0 compatible browser",
      "recommended": "Desktop browser with dedicated GPU"
    }
  }
}
```

## Collaborative Creation Model

SiHiRi NFTs support collaborative creation through component-based attribution:

```json
{
  "components": [
    {
      "name": "Character Design",
      "creator": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "asset_url": "ipfs://QmExample123",
      "license": "CC-BY-4.0",
      "royalty_share": 30
    },
    {
      "name": "Background Art",
      "creator": "ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "asset_url": "ipfs://QmExample456",
      "license": "CC-BY-SA-4.0",
      "royalty_share": 20
    },
    {
      "name": "Music Score",
      "creator": "ST3PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "asset_url": "ipfs://QmExample789",
      "license": "CC-BY-NC-4.0",
      "royalty_share": 25
    },
    {
      "name": "Animation",
      "creator": "ST4PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "asset_url": "ipfs://QmExampleABC",
      "license": "CC-BY-4.0",
      "royalty_share": 25
    }
  ]
}
```

This model enables:

- Clear attribution of each component to its creator
- Automatic royalty distribution based on contribution
- Licensing at the component level
- Reuse of components in other creative works

## Provenance Tracking

SiHiRi NFTs include comprehensive provenance tracking:

```json
{
  "provenance": {
    "creation": {
      "timestamp": "2023-04-15T12:00:00Z",
      "block_height": 78901,
      "transaction_id": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    },
    "transfers": [
      {
        "from": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        "to": "ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        "timestamp": "2023-05-20T14:30:00Z",
        "block_height": 79245,
        "transaction_id": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "sale_amount": 1000000,
        "currency": "STX"
      }
    ],
    "exhibitions": [
      {
        "name": "Digital Art Expo 2023",
        "curator": "ST3PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        "start_date": "2023-06-01T00:00:00Z",
        "end_date": "2023-06-30T23:59:59Z",
        "location": "Virtual Gallery Space",
        "url": "https://digitalartexpo.example.com/2023/gallery/digital-dreamscape"
      }
    ],
    "modifications": [
      {
        "version": 2,
        "timestamp": "2023-07-10T09:15:00Z",
        "description": "Updated background elements for summer season",
        "transaction_id": "0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef"
      }
    ]
  }
}
```

This tracking includes:

- Creation details
- Ownership transfers
- Exhibition history
- Modifications and version history

## Implementation in Clarity

The NFT primitives are implemented in Clarity smart contracts:

```clarity
;; NFT minting function
(define-public (mint (metadata-url (string-utf8 256)) (royalty-percent uint) (is-transferable bool))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
      (creator tx-sender)
    )
    ;; Validate royalty percentage (max 50%)
    (asserts! (<= royalty-percent u50) (err err-royalty-too-high))
    
    ;; Update token ID counter
    (var-set last-token-id token-id)
    
    ;; Create token record
    (map-set tokens
      { token-id: token-id }
      {
        owner: creator,
        creator: creator,
        metadata-url: metadata-url,
        royalty-percent: royalty-percent,
        is-transferable: is-transferable,
        creation-time: block-height
      }
    )
    
    ;; Set token ownership
    (map-set token-owners
      { token-id: token-id }
      { owner: creator }
    )
    
    ;; Set royalty recipient (initially just the creator)
    (map-set royalty-recipients
      { token-id: token-id }
      {
        primary-recipient: creator,
        secondary-recipients: (list)
      }
    )
    
    ;; Return the new token ID
    (ok token-id)
  )
)
```

## Future Extensions

Planned extensions to the NFT primitives include:

1. **Time-based Media Support**: Special handling for time-based works with duration, playback controls, and time-specific metadata

2. **Generative Art Parameters**: Support for generative art with seed values, algorithms, and parameter ranges

3. **Interactive Elements**: Embedding interactive elements directly in the NFT metadata

4. **Cross-chain Compatibility**: Standards for representing SiHiRi NFTs on other blockchains

5. **AI Attribution**: Clear tracking of AI-assisted components with proper attribution

## Best Practices for Creators

1. **Complete Metadata**: Include comprehensive metadata for discoverability and preservation

2. **Component Attribution**: Clearly attribute all components of collaborative works

3. **License Clarity**: Specify licenses for both the complete work and individual components

4. **Technical Specifications**: Include detailed technical information about the work

5. **Versioning**: Maintain clear version history for works that evolve over time