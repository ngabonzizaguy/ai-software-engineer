import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved API key
    const savedApiKey = localStorage.getItem('figmaApiKey') || process.env.NEXT_PUBLIC_FIGMA_API_KEY;
    if (savedApiKey) {
      setApiKey(savedApiKey);
      // If we have an API key from env, save it to localStorage
      if (process.env.NEXT_PUBLIC_FIGMA_API_KEY && !localStorage.getItem('figmaApiKey')) {
        localStorage.setItem('figmaApiKey', process.env.NEXT_PUBLIC_FIGMA_API_KEY);
      }
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      // Validate API key format
      if (!apiKey.startsWith('figd_')) {
        throw new Error('Invalid API key format. Key should start with "figd_"');
      }

      // Save API key
      localStorage.setItem('figmaApiKey', apiKey);
      setSuccess(true);

      // Optional: Validate the API key by making a test request
      try {
        const response = await fetch('/api/figma/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-figma-token': apiKey
          }
        });

        if (!response.ok) {
          throw new Error('Invalid API key');
        }
      } catch (err) {
        throw new Error('Failed to validate API key. Please check if it is correct.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      setSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Settings - AI Software Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your Figma API key and other preferences.
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  Figma API Key
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your Figma API key"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  You can find your API key in your Figma account settings.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-700">Settings saved successfully!</p>
                </div>
              )}

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${saving
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }
                  `}
                >
                  {saving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 