import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { UserSession } from '@stacks/connect';
import { FiEdit, FiShare2, FiGrid, FiList, FiHeart, FiDollarSign } from 'react-icons/fi';

export default function Profile() {
  const router = useRouter();
  const userSession = new UserSession();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [creativeWorks, setCreativeWorks] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('created');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if viewing own profile
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      // In a real app, we would check if the profile being viewed belongs to the current user
      // For demo purposes, we'll assume it's the current user's profile
      setIsCurrentUser(true);
      setProfileData({
        name: userData.profile?.name || 'Anonymous Creator',
        username: userData.profile?.username || 'creator',
        bio: userData.profile?.description || 'Creative professional exploring the world of Web3 and decentralized content.',
        avatar: userData.profile?.image?.[0]?.contentUrl || null,
        coverImage: null,
        stxAddress: userData.profile?.stxAddress?.mainnet,
        joinedDate: 'April 2023',
        followers: 128,
        following: 56,
        verified: true,
        socialLinks: {
          website: 'https://example.com',
          twitter: 'creator',
          instagram: 'creator',
        }
      });
    } else {
      // Mock data for demonstration when not signed in
      setProfileData({
        name: 'Elena Vega',
        username: 'elenavega',
        bio: 'Digital artist and blockchain enthusiast. Creating at the intersection of art and technology.',
        avatar: null,
        coverImage: null,
        stxAddress: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
        joinedDate: 'January 2023',
        followers: 256,
        following: 124,
        verified: true,
        socialLinks: {
          website: 'https://elenavega.art',
          twitter: 'elenavega_art',
          instagram: 'elenavega.art',
        }
      });
    }

    // Mock creative works data
    const mockWorks = [
      {
        id: 1,
        title: 'Digital Dreamscape',
        type: 'Artwork',
        preview: '/assets/placeholder-1.jpg',
        created: '2023-04-15',
        price: 25,
        likes: 47,
        status: 'Minted',
      },
      {
        id: 2,
        title: 'Harmony in Motion',
        type: 'Music',
        preview: '/assets/placeholder-2.jpg',
        created: '2023-05-22',
        price: 15,
        likes: 32,
        status: 'Listed',
      },
      {
        id: 3,
        title: 'Virtual Reality Experience',
        type: 'Interactive',
        preview: '/assets/placeholder-3.jpg',
        created: '2023-06-10',
        price: 50,
        likes: 18,
        status: 'Minted',
      },
      {
        id: 4,
        title: 'Sunset Serenity',
        type: 'Photography',
        preview: '/assets/placeholder-4.jpg',
        created: '2023-03-28',
        price: 10,
        likes: 65,
        status: 'Draft',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setCreativeWorks(mockWorks);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Render type badge with appropriate styling
  const renderTypeBadge = (type) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    switch(type.toLowerCase()) {
      case 'artwork':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      case 'music':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'interactive':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'photography':
        bgColor = 'bg-amber-100';
        textColor = 'text-amber-800';
        break;
      default:
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded ${bgColor} ${textColor}`}>
        {type}
      </span>
    );
  };

  // Render status badge with appropriate styling
  const renderStatusBadge = (status) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    switch(status) {
      case 'Minted':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'Listed':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'Draft':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
      default:
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  if (!profileData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            {profileData.coverImage && (
              <img 
                src={profileData.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
            {isCurrentUser && (
              <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                <FiEdit className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600 overflow-hidden z-10">
                {profileData.avatar ? (
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profileData.name.charAt(0)
                )}
              </div>
              
              <div className="md:ml-6 mt-4 md:mt-0">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
                  {profileData.verified && (
                    <span className="ml-2 text-blue-500" title="Verified Creator">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">@{profileData.username}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">Joined {profileData.joinedDate}</span>
                  <span className="mr-4">{profileData.followers} Followers</span>
                  <span>{profileData.following} Following</span>
                </div>
              </div>
              
              <div className="md:ml-auto mt-4 md:mt-0 flex space-x-2">
                {isCurrentUser ? (
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded">
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded">
                      Follow
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
                      <FiShare2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{profileData.bio}</p>
            
            <div className="flex flex-wrap items-center text-sm">
              <span className="text-gray-500 mr-2">STX:</span>
              <span className="font-mono text-gray-800 mr-4">{profileData.stxAddress}</span>
              
              {profileData.socialLinks.website && (
                <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 mr-4">
                  Website
                </a>
              )}
              
              {profileData.socialLinks.twitter && (
                <a href={`https://twitter.com/${profileData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 mr-4">
                  Twitter
                </a>
              )}
              
              {profileData.socialLinks.instagram && (
                <a href={`https://instagram.com/${profileData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`py-4 px-6 ${activeTab === 'created' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('created')}
              >
                Created
              </button>
              <button
                className={`py-4 px-6 ${activeTab === 'collected' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('collected')}
              >
                Collected
              </button>
              <button
                className={`py-4 px-6 ${activeTab === 'favorited' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('favorited')}
              >
                Favorited
              </button>
              {isCurrentUser && (
                <button
                  className={`py-4 px-6 ${activeTab === 'drafts' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('drafts')}
                >
                  Drafts
                </button>
              )}
            </nav>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-700">
                {activeTab === 'created' && 'Creative works created by this artist'}
                {activeTab === 'collected' && 'NFTs collected by this user'}
                {activeTab === 'favorited' && 'Works favorited by this user'}
                {activeTab === 'drafts' && 'Your unpublished drafts'}
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <FiGrid className="h-5 w-5 text-gray-700" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <FiList className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : creativeWorks.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creativeWorks.map(work => (
                    <div key={work.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-300">
                      <div className="relative">
                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                          <span className="text-4xl">{work.type === 'Artwork' ? '🎨' : work.type === 'Music' ? '🎵' : work.type === 'Interactive' ? '🎮' : '📷'}</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          {renderStatusBadge(work.status)}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{work.title}</h3>
                          {renderTypeBadge(work.type)}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <FiHeart className="h-4 w-4 mr-1" />
                            <span>{work.likes}</span>
                          </div>
                          
                          <div className="text-indigo-600 font-bold flex items-center">
                            <FiDollarSign className="h-4 w-4 mr-1" />
                            <span>{work.price} STX</span>
                          </div>
                        </div>
                        
                        <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {creativeWorks.map(work => (
                    <div key={work.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-300">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 bg-gray-100 flex items-center justify-center">
                          <span className="text-4xl">{work.type === 'Artwork' ? '🎨' : work.type === 'Music' ? '🎵' : work.type === 'Interactive' ? '🎮' : '📷'}</span>
                        </div>
                        
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{work.title}</h3>
                              <div className="flex items-center mt-1 space-x-2">
                                {renderTypeBadge(work.type)}
                                {renderStatusBadge(work.status)}
                              </div>
                            </div>
                            
                            <div className="text-indigo-600 font-bold">
                              {work.price} STX
                            </div>
                          </div>
                          
                          <p className="text-gray-500 text-sm mt-2">Created: {work.created}</p>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center text-gray-500 text-sm">
                              <FiHeart className="h-4 w-4 mr-1" />
                              <span>{work.likes} likes</span>
                            </div>
                            
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} works</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'created' && 'This creator hasn\'t published any works yet.'}
                  {activeTab === 'collected' && 'This user hasn\'t collected any NFTs yet.'}
                  {activeTab === 'favorited' && 'This user hasn\'t favorited any works yet.'}
                  {activeTab === 'drafts' && 'You don\'t have any drafts. Start creating!'}
                </p>
                {isCurrentUser && activeTab === 'created' && (
                  <div className="mt-6">
                    <button 
                      onClick={() => router.push('/upload')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create New Work
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}