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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Generate Code - AI Software Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Code</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure your code generation preferences and preview the output.
          </p>
        </div>

        {/* Quick Guide */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">Code Generation Guide</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>Select your preferred framework (React, Vue, or Angular)</li>
            <li>Choose a style format (CSS, SCSS, or Tailwind)</li>
            <li>Click "Generate Code" to create components and styles</li>
            <li>Review the generated code and copy what you need</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6 space-y-8">
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Framework</label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as Framework)}
                  className="
                    mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    dark:bg-gray-700 dark:text-white
                  "
                >
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                  <option value="angular">Angular</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Style Format</label>
                <select
                  value={styleFormat}
                  onChange={(e) => setStyleFormat(e.target.value as StyleFormat)}
                  className="
                    mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    dark:bg-gray-700 dark:text-white
                  "
                >
                  <option value="css">CSS</option>
                  <option value="scss">SCSS</option>
                  <option value="tailwind">Tailwind CSS</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`
                  w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent
                  rounded-md shadow-sm text-sm font-medium text-white
                  ${loading
                    ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate Code'}
              </button>
            </div>

            {/* Code Preview */}
            {generatedCode && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generated Code</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <pre className="p-4 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900">
                      {JSON.stringify(generatedCode, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 