import React from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';

/**
 * Layout Component
 * 
 * This component provides a consistent layout structure for all pages in the application.
 * It includes the navigation bar, main content area, and footer.
 */
const Layout = ({ children, title = 'SiHiRi - Creative OS', description = 'A decentralized creative ecosystem built on Clarity and Web3' }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;