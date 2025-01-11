import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check system preference and localStorage
    const darkModePreference = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkModePreference ? darkModePreference === 'true' : systemPrefersDark);
  }, []);

  useEffect(() => {
    // Update document class and localStorage when dark mode changes
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const navItems = [
    { href: '/', label: 'Extract Tokens', description: 'Extract design tokens from your Figma file' },
    { href: '/code', label: 'Generated Code', description: 'View and download generated code' },
    { href: '/settings', label: 'Settings', description: 'Configure your Figma API key' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile menu button */}
      <div className="lg:hidden p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Software Engineer</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <aside className={`
          ${isMobileMenuOpen ? 'block' : 'hidden'} 
          lg:block lg:w-64 lg:fixed lg:inset-y-0 
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        `}>
          <div className="h-full flex flex-col">
            <div className="hidden lg:flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Software Engineer</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group flex flex-col p-3 rounded-md transition-colors
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/50' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span className={`
                      font-medium
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-900 dark:text-white'
                      }
                    `}>
                      {item.label}
                    </span>
                    <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Dark mode toggle */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <span>Dark Mode</span>
                <div className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}
                `}>
                  <span className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={`
          flex-1 lg:pl-64
          ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
        `}>
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 