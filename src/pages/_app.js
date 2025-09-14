import 'regenerator-runtime/runtime';
import React, { useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { initAuth } from '../lib/auth';
import '../styles/globals.css';

/**
 * SiHiRi Application Component
 * 
 * This is the main application component that wraps all pages.
 * It initializes authentication and provides the Stacks Connect context.
 */
function SiHiRiApp({ Component, pageProps }) {
  // Initialize authentication when the app loads
  useEffect(() => {
    initAuth();
  }, []);

  // Configure the Stacks Connect library
  const appDetails = {
    name: 'SiHiRi',
    icon: '/assets/sihiri-logo.svg',
  };

  return (
    <Connect appDetails={appDetails}>
      <div className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
      </div>
    </Connect>
  );
}

export default SiHiRiApp;