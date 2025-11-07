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
    <nav className="bg-gray-800/50">
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
                   className="rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white">Dashboard</a>
                <button
                  onClick={onToggleHistoryDrawer}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  History
                </button>
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">API Docs</a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                id="themeToggle"
                onClick={handleThemeToggle}
                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-primary-500"
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
    </nav>
  );
};

export default Navbar;
