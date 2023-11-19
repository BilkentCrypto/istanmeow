import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white  fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-300">
      <div className="max-w-screen-xl mx-auto p-5 flex items-center justify-between">
        <span className="self-center text-2xl font-semibold whitespace-nowrap">
          <span className="text-nft font-bold text-pink-500">zk</span>
          <span className="text-q font-bold text-black">Hub</span>
        </span>
        <div className="hidden md:flex md:justify-center md:items-center   md:order-2 space-x-10 rtl:space-x-reverse">
          <Link
            to="/"
            className={
              location.pathname === '/'
                ? 'text-white font-semibold'
                : 'text-white font-semibold'
            }
          >
            Home
          </Link>
          <Link
            to="/About"
            className={
              location.pathname === '/About'
                ? 'text-white font-semibold '
                : 'text-white font-semibold '
            }
          >
            About
          </Link>
          <Link
            to="/Features"
            className={
              location.pathname === '/Features'
                ? 'text-white font-semibold '
                : 'text-white font-semibold'
            }
          >
            Features
          </Link>
        </div>
        <div className="flex md:order-3 space-x-3 rtl:space-x-reverse">
          <button
            type="button"
            className="text-white gap-2 just-center items-center flex bg-purple-400 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-purple-700 dark:hover:bg-purple-800 dark:focus:ring-blue-800"
          >

            Launch App
            <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
            </svg>
          </button>
          <button

            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
      </div>
      <ul
        className={`flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ${isMenuOpen ? 'block' : 'hidden'}`}
        id="navbar-sticky"
      >
        <li>
          <Link
            to="/"
            className={
              location.pathname === '/'
                ? 'block py-2 pr-4 text-white font-semibold pl-3 md:p-0'
                : 'block py-2 pr-4 pl-3 text-gray-400 font-semibold md:border-0 md:p-0'
            }
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/About"
            className={
              location.pathname === '/About'
                ? 'block py-2 pr-4 pl-3 text-white font-semibold md:p-0'
                : 'block py-2 pr-4 pl-3 text-gray-400 font-semibold md:border-0 md:p-0'
            }
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/Features"
            className={
              location.pathname === '/Features'
                ? 'block py-2 pr-4 pl-3 text-white font-semibold md:p-0'
                : 'block py-2 pr-4 pl-3 text-gray-400 font-semibold md:border-0 md:p-0'
            }
          >
            Features
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
