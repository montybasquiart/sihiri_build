import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FiFilter, FiSearch, FiHeart, FiBookmark } from 'react-icons/fi';

export default function Explore() {
  const [creativeWorks, setCreativeWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from the blockchain/API
    const mockData = [
      {
        id: 1,
        title: 'Digital Dreamscape',
        creator: 'Elena Vega',
        creatorAddress: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
        type: 'Artwork',
        preview: '/assets/placeholder-1.jpg',
        created: '2023-04-15',
        price: 25,
        likes: 47,
        verified: true,
      },
      {
        id: 2,
        title: 'Harmony in Motion',
        creator: 'Marcus Chen',
        creatorAddress: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28NKKPSLV',
        type: 'Music',
        preview: '/assets/placeholder-2.jpg',
        created: '2023-05-22',
        price: 15,
        likes: 32,
        verified: true,
      },
      {
        id: 3,
        title: 'Virtual Reality Experience',
        creator: 'Aisha Johnson',
        creatorAddress: 'SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB',
        type: 'Interactive',
        preview: '/assets/placeholder-3.jpg',
        created: '2023-06-10',
        price: 50,
        likes: 18,
        verified: false,
      },
      {
        id: 4,
        title: 'Sunset Serenity',
        creator: 'Carlos Rodriguez',
        creatorAddress: 'SP2JHG9HYTC63C6VE6C7NH5XTVF08YV7XHBDGB0K2',
        type: 'Photography',
        preview: '/assets/placeholder-4.jpg',
        created: '2023-03-28',
        price: 10,
        likes: 65,
        verified: true,
      },
      {
        id: 5,
        title: 'Blockchain Beats Vol. 1',
        creator: 'DJ Satoshi',
        creatorAddress: 'SP1QK1AYW1GHTM9H6M5FZQZMJ4XVXBXMCVMVH7FMH',
        type: 'Music',
        preview: '/assets/placeholder-5.jpg',
        created: '2023-07-05',
        price: 30,
        likes: 41,
        verified: true,
      },
      {
        id: 6,
        title: 'Quantum Thoughts',
        creator: 'Sophia Lee',
        creatorAddress: 'SP2X0TZ59D5SZ8ACQ6PCHYSQV9VEPKH0RX3D5WXT7',
        type: 'Article',
        preview: '/assets/placeholder-6.jpg',
        created: '2023-06-18',
        price: 5,
        likes: 29,
        verified: false,
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setCreativeWorks(mockData);
      setFilteredWorks(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter works by type
  const filterWorks = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredWorks(creativeWorks);
    } else {
      setFilteredWorks(creativeWorks.filter(work => work.type.toLowerCase() === filter));
    }
  };

  // Search works by title or creator
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      filterWorks(activeFilter); // Reset to current filter
    } else {
      const results = creativeWorks.filter(work => {
        // Apply both search and category filter
        const matchesSearch = work.title.toLowerCase().includes(term) || 
                             work.creator.toLowerCase().includes(term);
        const matchesFilter = activeFilter === 'all' || work.type.toLowerCase() === activeFilter;
        
        return matchesSearch && matchesFilter;
      });
      setFilteredWorks(results);
    }
  };

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
      case 'article':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Explore Creative Works</h1>
            
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title or creator"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
              </div>
              
              <div className="relative inline-block text-left">
                <button 
                  type="button" 
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <FiFilter className="mr-2 h-5 w-5" aria-hidden="true" />
                  Filter
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <button
              onClick={() => filterWorks('all')}
              className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All Works
            </button>
            <button
              onClick={() => filterWorks('artwork')}
              className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeFilter === 'artwork' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Artwork
            </button>
            <button
              onClick={() => filterWorks('music')}
              className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeFilter === 'music' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Music
            </button>
            <button
              onClick={() => filterWorks('interactive')}
              className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeFilter === 'interactive' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Interactive
            </button>
            <button
              onClick={() => filterWorks('photography')}
              className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeFilter === 'photography' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Photography
            </button>
            <button
              onClick={() => filterWorks('article')}
              className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeFilter === 'article' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Articles
            </button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map(work => (
                <div key={work.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative">
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-4xl">{work.type === 'Artwork' ? '🎨' : work.type === 'Music' ? '🎵' : work.type === 'Interactive' ? '🎮' : work.type === 'Photography' ? '📷' : '📄'}</span>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100">
                        <FiHeart className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100">
                        <FiBookmark className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{work.title}</h3>
                      {renderTypeBadge(work.type)}
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 mr-2">
                        {work.creator.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600">{work.creator}</span>
                      {work.verified && (
                        <span className="ml-1 text-blue-500" title="Verified Creator">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 text-xs">Created {work.created}</span>
                      </div>
                      <div className="text-indigo-600 font-bold">
                        {work.price} STX
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">We couldn't find any creative works matching your search.</p>
              <div className="mt-6">
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    filterWorks('all');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}