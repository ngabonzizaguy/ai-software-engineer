"use client"

import React from 'react';
import Link from 'next/link';
import { Moon, Sun, FileUp, Github } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we have access to the theme
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                AI System Prototype
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9" /> {/* Theme toggle placeholder */}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative min-h-[calc(100vh-4rem-4rem)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t py-6">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Built with modern technologies for a better development experience.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/yourusername/ai-software-engineer"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              AI System Prototype
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <FileUp className="w-4 h-4 mr-2" />
              Upload Figma File
            </button>
            <input
              id="file-upload"
              type="file"
              accept=".fig"
              className="hidden"
              onChange={(e) => {
                // Handle file upload
                console.log(e.target.files?.[0]);
              }}
            />

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="inline-flex items-center justify-center rounded-md w-9 h-9 bg-muted hover:bg-muted/80 transition-colors"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative min-h-[calc(100vh-4rem-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with modern technologies for a better development experience.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/yourusername/ai-software-engineer"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <Github className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 