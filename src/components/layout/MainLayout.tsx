import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/', label: 'Extract Tokens' },
    { path: '/code', label: 'Generated Code' },
    { path: '/settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors font-poppins">
      {/* Mobile menu button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg"
        >
          <svg
            className="h-6 w-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
          border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
              AI Software Engineer
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
            >
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all scale-100 rotate-0 dark:scale-0 dark:rotate-90" />
              <Moon className="absolute h-5 w-5 text-gray-600 dark:text-gray-300 transition-all scale-0 -rotate-90 dark:scale-100 dark:rotate-0 top-2 left-2" />
              <span className="sr-only">Toggle theme</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${isActive(path)
                    ? 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 dark:from-blue-500/20 dark:to-violet-500/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {label}
                {isActive(path) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg shadow-blue-500/50" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:pl-64">
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-gray-600/75 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Content */}
        <div className="relative min-h-screen">
          {/* Top gradient effect */}
          <div className="absolute inset-x-0 top-0 -z-10 h-64 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-violet-500/5 to-transparent dark:from-blue-500/10 dark:via-violet-500/10 transform-gpu blur-3xl" />
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
} 