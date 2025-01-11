import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!fileId.trim()) {
      setError('Please enter a Figma file ID');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const apiKey = localStorage.getItem('figmaApiKey');
      if (!apiKey) {
        throw new Error('Figma API key not found. Please add it in Settings.');
      }

      const response = await fetch('/api/figma/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Figma-Token': apiKey
        },
        body: JSON.stringify({ fileId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to extract tokens');
      }

      const data = await response.json();
      localStorage.setItem('extractedTokens', JSON.stringify(data));
      router.push('/code');
    } catch (err: any) {
      setError(err.message || 'Failed to extract tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Head>
        <title>AI Software Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="w-full max-w-md mx-auto p-4">
        <div className="glass rounded-xl overflow-hidden backdrop-blur-xl p-6 relative">
          {/* Gradient orbs */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-500/30 rounded-full blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent text-center mb-2">
              Design Token Extractor
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Transform your Figma designs into code with a single click
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
                  Figma File ID
                </label>
                <input
                  type="text"
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  placeholder="Paste your Figma file ID here"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white shadow-sm backdrop-blur-xl transition-colors hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Find this in your Figma file's URL
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleExtract}
                disabled={loading}
                className={`
                  relative w-full px-6 py-2.5 rounded-lg font-medium text-white
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
                    Extracting...
                  </span>
                ) : (
                  <>
                    Extract Tokens
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 