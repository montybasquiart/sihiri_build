import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import Link from 'next/link';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiGrid, FiDollarSign, FiUsers } from 'react-icons/fi';

const Navigation = () => {
  const { authOptions, userSession } = useConnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isUserSignedIn = userSession && userSession.isUserSignedIn();
  
  const handleSignIn = () => {
    authOptions.appDetails.name = 'SiHiRi';
    authOptions.appDetails.icon = '/assets/sihiri-logo.svg';
    authOptions.redirectTo = '/';
    authOptions.onFinish = () => {
      window.location.reload();
    };
    authOptions.userSession = userSession;
    
    if (authOptions.showProfile !== false) {
      authOptions.showProfile = true;
    }
    
    userSession.redirectToSignIn();
  };
  
  const handleSignOut = () => {
    userSession.signUserOut();
    window.location.reload();
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <img
                    className="h-8 w-auto"
                    src="/assets/sihiri-logo.svg"
                    alt="SiHiRi"
                  />
                  <span className="ml-2 text-xl font-bold text-indigo-600">SiHiRi</span>
                </a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900">
                  <FiHome className="mr-1" /> Home
                </a>
              </Link>
              <Link href="/explore">
                <a className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  <FiGrid className="mr-1" /> Explore
                </a>
              </Link>
              {isUserSignedIn && (
                <>
                  <Link href="/dashboard">
                    <a className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      <FiUser className="mr-1" /> Dashboard
                    </a>
                  </Link>
                  <Link href="/earnings">
                    <a className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      <FiDollarSign className="mr-1" /> Earnings
                    </a>
                  </Link>
                  <Link href="/collaborations">
                    <a className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      <FiUsers className="mr-1" /> Collaborations
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isUserSignedIn ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiLogOut className="mr-2" /> Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiUser className="mr-2" /> Sign In with Stacks
              </button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className="block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50">
                <FiHome className="inline mr-2" /> Home
              </a>
            </Link>
            <Link href="/explore">
              <a className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                <FiGrid className="inline mr-2" /> Explore
              </a>
            </Link>
            {isUserSignedIn && (
              <>
                <Link href="/dashboard">
                  <a className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                    <FiUser className="inline mr-2" /> Dashboard
                  </a>
                </Link>
                <Link href="/earnings">
                  <a className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                    <FiDollarSign className="inline mr-2" /> Earnings
                  </a>
                </Link>
                <Link href="/collaborations">
                  <a className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                    <FiUsers className="inline mr-2" /> Collaborations
                  </a>
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isUserSignedIn ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Stacks User</div>
                  <button
                    onClick={handleSignOut}
                    className="mt-1 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <FiLogOut className="mr-1" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center px-4">
                <button
                  onClick={handleSignIn}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiUser className="mr-2" /> Sign In with Stacks
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;