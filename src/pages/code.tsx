import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { Framework, StyleFormat } from '@/features/codeGeneration/types';

export default function Code() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [framework, setFramework] = useState<Framework>('react');
  const [styleFormat, setStyleFormat] = useState<StyleFormat>('css');
  const [generatedCode, setGeneratedCode] = useState<any>(null);

  useEffect(() => {
    const tokens = localStorage.getItem('extractedTokens');
    if (!tokens) {
      router.push('/');
    }
  }, [router]);

  const handleGenerate = async () => {
    setError('');
    setLoading(true);

    try {
      const tokens = JSON.parse(localStorage.getItem('extractedTokens') || '[]');
      const response = await fetch('/api/figma/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          options: {
            framework,
            styleFormat,
            typescript: true,
            prettier: true
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate code');
      }

      const data = await response.json();
      setGeneratedCode(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6">
      <Head>
        <title>Generate Code - AI Software Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="container max-w-4xl mx-auto px-4 flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            Generate Code
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure your code generation preferences and preview the output.
          </p>
        </div>

        <div className="glass shadow-lg rounded-lg flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
                  Framework
                </label>
                <div className="relative">
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as Framework)}
                    className="appearance-none w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                  >
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
                  Style Format
                </label>
                <div className="relative">
                  <select
                    value={styleFormat}
                    onChange={(e) => setStyleFormat(e.target.value as StyleFormat)}
                    className="appearance-none w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm transition-colors hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                  >
                    <option value="css">CSS</option>
                    <option value="scss">SCSS</option>
                    <option value="tailwind">Tailwind CSS</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`
                  relative w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white
                  transition-all duration-200 ease-in-out
                  ${loading
                    ? 'bg-blue-400/80 dark:bg-blue-500/80 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-violet-500 hover:from-blue-700 hover:to-violet-700 dark:hover:from-blue-600 dark:hover:to-violet-600 shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    Generate Code
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Preview with fixed height and scrolling */}
          {generatedCode && (
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-4">
                Generated Code
              </h3>
              <div className="border border-gray-200/50 dark:border-gray-700/50 rounded-lg overflow-hidden backdrop-blur-sm">
                <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  <pre className="p-4 text-sm text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-gray-900/50 whitespace-pre-wrap">
                    {JSON.stringify(generatedCode, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 