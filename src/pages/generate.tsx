import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { TokenSet } from '@/features/designTokens/types';

export default function GeneratePage() {
  const [framework, setFramework] = useState('react');
  const [styleFormat, setStyleFormat] = useState('css');
  const [tokens, setTokens] = useState<TokenSet | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    // Load tokens from localStorage
    const savedTokens = localStorage.getItem('extractedTokens');
    if (savedTokens) {
      try {
        const parsedTokens = JSON.parse(savedTokens);
        // Validate that we have the required token structure
        if (!parsedTokens || typeof parsedTokens !== 'object') {
          throw new Error('Invalid token structure');
        }
        setTokens(parsedTokens);
        setError('');
      } catch (err) {
        setError('Failed to load tokens. Please extract tokens first.');
        setTokens(null);
      }
    } else {
      setError('No tokens found. Please extract tokens first.');
      setTokens(null);
    }
  }, []);

  const handleGenerate = async () => {
    if (!tokens) {
      setError('Please extract tokens first from the Design Tokens page');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert tokens to array format expected by the API
      const tokenArray = Object.entries(tokens).map(([category, values]) => ({
        category,
        tokens: Object.entries(values || {}).map(([name, value]) => ({
          name,
          value,
        })),
      }));

      const response = await fetch('/api/figma/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokens: tokenArray, // Send tokens in the expected array format
          options: {
            framework,
            styleFormat,
            typescript: true,
            prettier: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate code');
      }

      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (err: any) {
      setError(err.message || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Code Generation - AI System Prototype</title>
      </Head>

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Code Generation</h1>
        <p className="text-muted-foreground mb-8">
          Generate code snippets and full components with AI assistance
        </p>

        <div className="grid gap-6">
          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Configuration</h2>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    tokens ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {tokens ? 'Tokens Loaded' : 'No Tokens'}
                </span>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Framework</label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Style Format</label>
                  <select
                    value={styleFormat}
                    onChange={(e) => setStyleFormat(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="css">CSS</option>
                    <option value="scss">SCSS</option>
                    <option value="styled">Styled Components</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !tokens}
                className="inline-flex items-center justify-center h-12 px-6 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  'Generate Code'
                )}
              </button>
            </div>
          </div>

          {generatedCode && (
            <div className="p-6 rounded-lg border bg-card">
              <h2 className="text-lg font-semibold mb-6">Generated Code</h2>
              <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 