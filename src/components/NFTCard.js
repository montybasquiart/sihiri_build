import React from 'react';
import { getIPFSGatewayUrl } from '../lib/storage';
import { nftContract, identityContract } from '../lib/contracts';

/**
 * NFTCard Component
 * 
 * This component displays an NFT card with image, title, creator, and price information.
 * It's used in the marketplace, collection views, and search results.
 */
const NFTCard = ({ 
  tokenId, 
  metadata, 
  creator, 
  price = null, 
  isListed = false, 
  isAuction = false,
  onClick,
}) => {
  // Format the image URL from IPFS CID
  const imageUrl = metadata?.image ? 
    getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : 
    '/assets/placeholder-image.svg';
  
  // Format the animation URL if it exists
  const animationUrl = metadata?.animation_url ? 
    getIPFSGatewayUrl(metadata.animation_url.replace('ipfs://', '')) : 
    null;
  
  // Determine the media type
  const mediaType = metadata?.media_type || 'image';
  
  // Format creator name
  const creatorName = creator?.username || creator?.name || 'Anonymous Creator';
  
  // Handle card click
  const handleClick = () => {
    if (onClick) {
      onClick(tokenId);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Media Preview */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {mediaType === 'video' && animationUrl ? (
          <video 
            src={animationUrl}
            className="w-full h-full object-cover"
            muted 
            autoPlay 
            loop
            playsInline
          />
        ) : mediaType === 'audio' && animationUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <img 
              src={imageUrl} 
              alt={metadata?.name || `NFT #${tokenId}`}
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        ) : mediaType === '3d' && animationUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0l10 6.667-10 6.666L0 6.667 10 0zm0 16.667l-7.5-5V7.5L10 12.5l7.5-5v4.167l-7.5 5z" />
              </svg>
            </div>
            <img 
              src={imageUrl} 
              alt={metadata?.name || `NFT #${tokenId}`}
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt={metadata?.name || `NFT #${tokenId}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/placeholder-image.svg';
            }}
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex space-x-1">
          {isListed && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {isAuction ? 'Auction' : 'For Sale'}
            </span>
          )}
          {metadata?.media_type && (
            <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full capitalize">
              {metadata.media_type}
            </span>
          )}
        </div>
      </div>
      
      {/* NFT Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {metadata?.name || `NFT #${tokenId}`}
        </h3>
        
        <div className="flex items-center mt-1">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 truncate">{creatorName}</p>
        </div>
        
        {price && (
          <div className="mt-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">{isAuction ? 'Current Bid' : 'Price'}</p>
              <p className="text-md font-bold text-gray-900">{price} STX</p>
            </div>
            
            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">
              {isAuction ? 'Place Bid' : 'Buy Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * NFTCardSkeleton Component
 * 
 * This component displays a loading skeleton for NFT cards
 */
export const NFTCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex items-center mt-1">
          <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * NFTCardGrid Component
 * 
 * This component displays a grid of NFT cards
 */
export const NFTCardGrid = ({ nfts, isLoading, onNFTClick }) => {
  // Generate skeleton cards for loading state
  const skeletonCards = Array(8).fill(0).map((_, index) => (
    <NFTCardSkeleton key={`skeleton-${index}`} />
  ));
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isLoading ? (
        skeletonCards
      ) : nfts.length > 0 ? (
        nfts.map((nft) => (
          <NFTCard
            key={nft.tokenId}
            tokenId={nft.tokenId}
            metadata={nft.metadata}
            creator={nft.creator}
            price={nft.price}
            isListed={nft.isListed}
            isAuction={nft.isAuction}
            onClick={onNFTClick}
          />
        ))
      ) : (
        <div className="col-span-full py-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No NFTs Found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating or collecting an NFT.</p>
        </div>
      )}
    </div>
  );
};

export default NFTCard;