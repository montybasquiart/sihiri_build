import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import Layout from '../components/Layout';
import { AppConfig, UserSession } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

// Initialize Stacks authentication
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Set network (testnet for development)
const network = new StacksTestnet();

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setAuthenticated(true);
      setUserData(userSession.loadUserData());
    }
  }, []);

  const handleSignIn = () => {
    userSession.redirectToSignIn();
  };

  const handleSignOut = () => {
    userSession.signUserOut();
    setAuthenticated(false);
    setUserData(null);
  };

  return (
    <Layout
      title="SiHiRi - Creative OS"
      description="A decentralized creative ecosystem built on Clarity and Web3"
    >
      <div className="container mx-auto px-4 py-8">
        {authenticated ? (
          <CreatorDashboard userData={userData} />
        ) : (
          <LandingPage handleSignIn={handleSignIn} />
        )}
      </div>
    </Layout>
  );
}

function LandingPage({ handleSignIn }) {
  return (
    <div className="text-center text-gray-800">
      <h1 className="text-5xl font-bold mb-6">Welcome to SiHiRi</h1>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        A decentralized creative ecosystem built on Clarity and Web3, empowering artists, filmmakers, musicians, game developers, and the broader creative industry.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        <FeatureCard 
          icon="🎨" 
          title="Create & Mint" 
          description="Mint your creative works as NFTs with dynamic metadata and royalty settings."
        />
        <FeatureCard 
          icon="🤝" 
          title="Collaborate" 
          description="Work with other creators and split royalties automatically through smart contracts."
        />
        <FeatureCard 
          icon="💰" 
          title="Earn" 
          description="Sell your work, receive commissions, and earn ongoing royalties from secondary sales."
        />
        <FeatureCard 
          icon="🔄" 
          title="Preserve" 
          description="Your creative works are stored permanently on decentralized storage networks."
        />
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Join the Creative Revolution</h2>
        <button 
          onClick={handleSignIn}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
        >
          Connect Wallet to Begin
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-indigo-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function CreatorDashboard({ userData }) {
  const [activeTab, setActiveTab] = useState('works');
  const [creativeWorks, setCreativeWorks] = useState([]);
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from the blockchain/API
    setCreativeWorks([
      {
        id: 1,
        title: 'Digital Dreamscape',
        type: 'Artwork',
        preview: '/assets/placeholder-1.jpg',
        created: '2023-04-15',
        status: 'Minted',
      },
      {
        id: 2,
        title: 'Harmony in Motion',
        type: 'Music',
        preview: '/assets/placeholder-2.jpg',
        created: '2023-05-22',
        status: 'Draft',
      },
      {
        id: 3,
        title: 'Virtual Reality Experience',
        type: 'Interactive',
        preview: '/assets/placeholder-3.jpg',
        created: '2023-06-10',
        status: 'Listed',
      },
    ]);
  }, []);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Creator Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            {userData?.profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{userData?.profile?.name || 'Anonymous Creator'}</h3>
            <p className="text-gray-500">{userData?.profile?.stxAddress?.mainnet}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <nav className="flex border-b border-gray-200">
          <button
            className={`py-3 px-6 ${activeTab === 'works' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('works')}
          >
            My Works
          </button>
          <button
            className={`py-3 px-6 ${activeTab === 'marketplace' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('marketplace')}
          >
            Marketplace
          </button>
          <button
            className={`py-3 px-6 ${activeTab === 'collaborations' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('collaborations')}
          >
            Collaborations
          </button>
          <button
            className={`py-3 px-6 ${activeTab === 'earnings' ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
        </nav>
      </div>

      {activeTab === 'works' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">My Creative Works</h3>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Create New
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creativeWorks.map(work => (
              <div key={work.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl">{work.type === 'Artwork' ? '🎨' : work.type === 'Music' ? '🎵' : '🎮'}</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-gray-800">{work.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${work.status === 'Minted' ? 'bg-green-100 text-green-800' : work.status === 'Listed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {work.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{work.type}</p>
                  <p className="text-gray-500 text-xs mt-4">Created: {work.created}</p>
                  <div className="mt-4 flex space-x-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1 px-3 rounded">
                      View
                    </button>
                    {work.status === 'Draft' && (
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded">
                        Mint
                      </button>
                    )}
                    {work.status === 'Minted' && (
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded">
                        List for Sale
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Create New Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-indigo-500 transition duration-300 flex items-center justify-center h-full cursor-pointer">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-600 mx-auto mb-4">
                  +
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Create New Work</h4>
                <p className="text-gray-600 text-sm mt-1">Upload and mint your creative work</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Marketplace</h3>
          <p className="text-gray-600">The marketplace is coming soon in the next phase of development.</p>
        </div>
      )}

      {activeTab === 'collaborations' && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Collaborations</h3>
          <p className="text-gray-600">Collaboration features are coming soon in the next phase of development.</p>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Earnings</h3>
          <p className="text-gray-600">Earnings tracking is coming soon in the next phase of development.</p>
        </div>
      )}
    </div>
  );
}