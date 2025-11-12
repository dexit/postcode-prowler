import React, { useState, useEffect, useCallback } from 'react';
import { SunIcon, MoonIcon, MenuIcon, XIcon } from './Icons';

interface NavbarProps {
  onToggleHistoryDrawer: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleHistoryDrawer }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize based on localStorage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center">
            <div className="shrink-0">
              <a href="#" className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Postcode Prowler Pro <span className="text-primary-500">🕵️‍♂️</span>
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Uncover the secrets behind every UK postcode
                </span>
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" aria-current="page"
                   className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-900 dark:bg-gray-950/50 dark:text-white">Dashboard</a>
                <button
                  onClick={onToggleHistoryDrawer}
                  className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200 text-sm font-medium dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  History
                </button>
                <a href="#" className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200 text-sm font-medium dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white">API Docs</a>
              </div>
            </div>
          </div>

          {/* Mobile menu button and Desktop Theme Toggle */}
          <div className="flex items-center">
            <div className="hidden md:block">
              <button
                id="themeToggle"
                onClick={handleThemeToggle}
                className="relative rounded-full p-1 text-gray-600 hover:text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-primary-500 dark:text-gray-400 dark:hover:text-white"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Toggle theme</span>
                {isDarkMode ? (
                  <MoonIcon className="size-6" />
                ) : (
                  <SunIcon className="size-6" />
                )}
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XIcon className="block h-6 w-6" />
                ) : (
                  <MenuIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <a href="#" aria-current="page"
               className="block rounded-md bg-gray-200 px-3 py-2 text-base font-medium text-gray-900 dark:bg-gray-900 dark:text-white">Dashboard</a>
            <button
              onClick={() => { onToggleHistoryDrawer(); toggleMobileMenu(); }}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white w-full text-left"
            >
              History
            </button>
            <a href="#"
               className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">API Docs</a>
            <button
              onClick={handleThemeToggle}
              className="relative rounded-full p-1 text-gray-600 hover:text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-primary-500 dark:text-gray-400 dark:hover:text-white w-full text-left flex items-center gap-2 mt-2"
            >
              {isDarkMode ? (
                <MoonIcon className="size-6" />
              ) : (
                <SunIcon className="size-6" />
              )}
              <span>Toggle Theme</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;