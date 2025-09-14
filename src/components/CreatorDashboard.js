import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { userSession } from '../lib/auth';

/**
 * CreatorDashboard Component
 * 
 * This component serves as the main dashboard for creators in the SiHiRi platform.
 * It provides access to the creator's works, marketplace listings, collaborations,
 * and earnings information.
 */
const CreatorDashboard = () => {
  const { doOpenAuth } = useConnect();
  const [activeTab, setActiveTab] = useState('works');
  
  // Check if user is authenticated
  const isAuthenticated = userSession.isUserSignedIn();
  
  // Mock data for demonstration purposes
  const mockWorks = [
    { id: 1, title: 'Digital Dreamscape', type: 'Digital Art', created: '2023-04-15', status: 'Published' },
    { id: 2, title: 'Harmony in Motion', type: 'Music', created: '2023-05-20', status: 'Draft' },
    { id: 3, title: 'Urban Perspectives', type: 'Photography', created: '2023-06-10', status: 'Published' },
  ];
  
  const mockMarketplace = [
    { id: 1, title: 'Digital Dreamscape', type: 'Fixed Price', price: '1000 STX', listed: '2023-04-20', views: 245 },
    { id: 3, title: 'Urban Perspectives', type: 'Auction', price: 'Current Bid: 750 STX', listed: '2023-06-15', views: 189 },
  ];
  
  const mockCollaborations = [
    { id: 1, title: 'Cosmic Collaboration', role: 'Lead Artist', collaborators: 3, status: 'In Progress' },
    { id: 2, title: 'Sonic Fusion', role: 'Composer', collaborators: 2, status: 'Completed' },
  ];
  
  const mockEarnings = {
    total: '5250 STX',
    thisMonth: '750 STX',
    pending: '250 STX',
    history: [
      { date: '2023-06-15', amount: '250 STX', type: 'Sale', work: 'Urban Perspectives' },
      { date: '2023-05-30', amount: '500 STX', type: 'Royalty', work: 'Digital Dreamscape' },
      { date: '2023-05-10', amount: '1000 STX', type: 'Sale', work: 'Digital Dreamscape' },
    ],
  };
  
  // Handle login
  const handleLogin = () => {
    doOpenAuth();
  };
  
  // Handle logout
  const handleLogout = () => {
    userSession.signUserOut();
    window.location.reload();
  };
  
  // Render login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Creator Dashboard</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in with your Stacks wallet to access your creative works and earnings
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Works</h3>
          <p className="text-2xl font-semibold">{mockWorks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Listed in Marketplace</h3>
          <p className="text-2xl font-semibold">{mockMarketplace.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Collaborations</h3>
          <p className="text-2xl font-semibold">{mockCollaborations.filter(c => c.status === 'In Progress').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-semibold">{mockEarnings.total}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${activeTab === 'works' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('works')}
          >
            My Works
          </button>
          <button
            className={`${activeTab === 'marketplace' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('marketplace')}
          >
            Marketplace
          </button>
          <button
            className={`${activeTab === 'collaborations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('collaborations')}
          >
            Collaborations
          </button>
          <button
            className={`${activeTab === 'earnings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'works' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Creative Works</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Create New Work
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockWorks.map((work) => (
                    <tr key={work.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{work.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.created}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${work.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {work.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'marketplace' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Marketplace Listings</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Create New Listing
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockMarketplace.map((listing) => (
                    <tr key={listing.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{listing.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.listed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delist</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'collaborations' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Collaborations</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Start New Collaboration
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborators</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockCollaborations.map((collab) => (
                    <tr key={collab.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collab.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collab.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collab.collaborators}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${collab.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {collab.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'earnings' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <p className="text-2xl font-semibold">{mockEarnings.total}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                <p className="text-2xl font-semibold">{mockEarnings.thisMonth}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-semibold">{mockEarnings.pending}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockEarnings.history.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.work}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;