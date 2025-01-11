import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiKey = localStorage.getItem('figmaApiKey');
      if (!apiKey) {
        throw new Error('Figma API key not found. Please add it in settings.');
      }

      const response = await fetch('/api/figma/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-figma-token': apiKey
        },
        body: JSON.stringify({ fileId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to extract tokens');
      }

      const tokens = await response.json();
      localStorage.setItem('extractedTokens', JSON.stringify(tokens));
      router.push('/code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Extract Design Tokens - AI Software Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Extract Design Tokens</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your Figma file ID to extract design tokens and generate code.
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">Quick Start Guide</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>Open your Figma file in the browser</li>
            <li>Copy the file ID from the URL (e.g., https://www.figma.com/file/<strong>FILE_ID</strong>/)</li>
            <li>Paste the file ID below and click "Extract Tokens"</li>
            <li>Once extracted, you'll be taken to the code generation page</li>
          </ol>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleExtract} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="fileId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Figma File ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="fileId"
                    value={fileId}
                    onChange={(e) => setFileId(e.target.value)}
                    placeholder="Enter your Figma file ID"
                    className="
                      block w-full rounded-md border-gray-300 dark:border-gray-600
                      shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                      dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                    "
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You can find the file ID in your Figma file's URL.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || !fileId}
                  className={`
                    w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                    shadow-sm text-sm font-medium text-white
                    ${loading
                      ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
                      : fileId
                        ? 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Extracting...
                    </span>
                  ) : 'Extract Tokens'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 