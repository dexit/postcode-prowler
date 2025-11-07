import React, { useState, useEffect, useCallback } from 'react';
import { SunIcon, MoonIcon } from './Icons';

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

  return (
    <nav className="bg-gray-100/50 dark:bg-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                   alt="Postcode Prowler" className="size-8" />
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
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
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
          </div>
        </div>
      </div>
      {/* Header section integrated below navbar for branding */}
      <div className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="mx-auto max-w-[90vw] px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Postcode Prowler Pro <span className="text-primary-500">🕵️‍♂️</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Uncover the secrets behind every UK postcode</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;