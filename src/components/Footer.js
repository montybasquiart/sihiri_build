import React from 'react';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiMessageCircle, FiBook } from 'react-icons/fi';

/**
 * Footer Component
 * 
 * This component provides a consistent footer for all pages in the application.
 * It includes links to documentation, social media, and other resources.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/about">
              <a className="text-base text-gray-300 hover:text-white">
                About
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/docs">
              <a className="text-base text-gray-300 hover:text-white">
                Documentation
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/marketplace">
              <a className="text-base text-gray-300 hover:text-white">
                Marketplace
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/creators">
              <a className="text-base text-gray-300 hover:text-white">
                Creators
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/privacy">
              <a className="text-base text-gray-300 hover:text-white">
                Privacy
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/terms">
              <a className="text-base text-gray-300 hover:text-white">
                Terms
              </a>
            </Link>
          </div>
        </nav>

        <div className="mt-8 flex justify-center space-x-6">
          <a href="https://github.com/sihiri/sihiri" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">GitHub</span>
            <FiGithub className="h-6 w-6" />
          </a>

          <a href="https://twitter.com/SiHiRiOS" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Twitter</span>
            <FiTwitter className="h-6 w-6" />
          </a>

          <a href="https://discord.gg/sihiri" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Discord</span>
            <FiMessageCircle className="h-6 w-6" />
          </a>

          <a href="https://forum.sihiri.org" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Forum</span>
            <FiBook className="h-6 w-6" />
          </a>
        </div>

        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} SiHiRi. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;