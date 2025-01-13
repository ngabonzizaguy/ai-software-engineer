import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Paintbrush, 
  Type, 
  Box, 
  Download,
  History,
  RotateCcw,
  ArrowLeftRight
} from 'lucide-react';
import { TokenSet } from '@/features/designTokens/types';
import { TokenHistoryManager } from '@/features/designTokens/tokenHistory';

type ExportFormat = 'css' | 'scss' | 'json' | 'ts';

interface RecentFile {
  id: string;
  timestamp: number;
  name?: string;
}

export default function TokensPage() {
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExtracted, setShowExtracted] = useState(false);
  const [tokens, setTokens] = useState<TokenSet | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  const [exporting, setExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);
  const [versionChanges, setVersionChanges] = useState<any[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    const savedTokens = localStorage.getItem('extractedTokens');
    if (savedTokens) {
      try {
        setTokens(JSON.parse(savedTokens));
      } catch (err) {
        console.error('Failed to parse saved tokens:', err);
      }
    }
  }, []);

  useEffect(() => {
    const savedFiles = localStorage.getItem('recentFigmaFiles');
    if (savedFiles) {
      try {
        setRecentFiles(JSON.parse(savedFiles));
      } catch (err) {
        console.error('Failed to load recent files:', err);
      }
    }
  }, []);

  const addToRecentFiles = (id: string) => {
    const newFile: RecentFile = {
      id,
      timestamp: Date.now(),
    };

    const updatedFiles = [
      newFile,
      ...recentFiles.filter(file => file.id !== id).slice(0, 4)
    ];

    setRecentFiles(updatedFiles);
    localStorage.setItem('recentFigmaFiles', JSON.stringify(updatedFiles));
  };

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

      addToRecentFiles(fileId);

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
      TokenHistoryManager.saveVersion(data, fileId, 'Extracted from Figma');
      setTokens(data);
      setShowExtracted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to extract tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!tokens) return;

    setExporting(true);
    try {
      const response = await fetch('/api/figma/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokens, format: exportFormat })
      });

      if (!response.ok) {
        throw new Error('Failed to export tokens');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `design-tokens.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to export tokens');
    } finally {
      setExporting(false);
    }
  };

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      setCompareVersion(versionId);
      if (selectedVersion) {
        const changes = TokenHistoryManager.compareVersions(selectedVersion, versionId);
        setVersionChanges(changes);
      }
    } else {
      setSelectedVersion(versionId);
      const version = TokenHistoryManager.getVersion(versionId);
      if (version) {
        setTokens(version.tokens);
      }
    }
  };

  const handleRevertVersion = (versionId: string) => {
    const revertedTokens = TokenHistoryManager.revertToVersion(versionId);
    if (revertedTokens) {
      setTokens(revertedTokens);
      setSelectedVersion(null);
      setShowHistory(false);
    }
  };

  const TokenSection = ({ title, icon: Icon, children, isVisible = true }: any) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    if (!isVisible) return null;
    return (
      <div className="border rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50"
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon className="w-5 h-5" />
            <h3>{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {isExpanded && <div className="p-4 border-t">{children}</div>}
      </div>
    );
  };

  const VersionHistoryPanel = () => {
    const history = TokenHistoryManager.getHistory();
    
    return (
      <div className="border-l bg-card w-80 p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Version History</h3>
          <button
            onClick={() => {
              setShowHistory(false);
              setCompareMode(false);
              setSelectedVersion(null);
              setCompareVersion(null);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`text-sm ${compareMode ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Compare
          </button>
        </div>

        <div className="space-y-2">
          {history.map((version) => (
            <div
              key={version.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                version.id === selectedVersion || version.id === compareVersion
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-accent'
              }`}
              onClick={() => handleVersionSelect(version.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {new Date(version.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRevertVersion(version.id);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {version.description || `Version ${version.id.slice(0, 8)}`}
              </p>
            </div>
          ))}
        </div>

        {compareMode && versionChanges.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Changes</h4>
            {versionChanges.map((change, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs ${
                  change.type === 'added'
                    ? 'bg-green-500/10 text-green-700'
                    : change.type === 'removed'
                    ? 'bg-red-500/10 text-red-700'
                    : 'bg-yellow-500/10 text-yellow-700'
                }`}
              >
                <span className="font-medium">
                  {change.type.charAt(0).toUpperCase() + change.type.slice(1)}:
                </span>{' '}
                {change.path.join('.')}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>AI Design Transformer - Design to Code</title>
      </Head>

      <div className="flex">
        <div className="flex-1 container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Design Transformer</h1>
              <p className="text-muted-foreground">
                Transform your Figma designs into production-ready code with AI assistance. Extract design tokens, generate components, and maintain design consistency.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium bg-accent/50 hover:bg-accent rounded-md transition-colors"
              >
                Dashboard
              </button>
              {tokens && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-medium transition-colors hover:bg-accent ${
                    showHistory ? 'bg-accent' : ''
                  }`}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            {/* Token Extraction Card */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Extract Design System</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect your Figma file to extract design tokens and prepare for code generation
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      tokens ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {tokens ? 'Design System Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Figma File URL or ID
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                        placeholder="Paste your Figma file URL or ID here"
                        className="flex-1 h-12 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <button
                        onClick={handleExtract}
                        disabled={loading}
                        className="inline-flex items-center justify-center h-12 px-6 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] shadow-sm"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing...
                          </span>
                        ) : (
                          'Connect Design'
                        )}
                      </button>
                    </div>

                    {recentFiles.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Recent Designs</label>
                        <div className="flex flex-wrap gap-2">
                          {recentFiles.map((file) => (
                            <button
                              key={file.id}
                              onClick={() => setFileId(file.id)}
                              className="inline-flex items-center px-4 py-2 text-sm bg-accent/50 hover:bg-accent rounded-md transition-colors gap-2"
                            >
                              <span className="truncate max-w-[200px]">{file.id}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(file.timestamp).toLocaleDateString()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Copy the URL of your Figma design file or extract the file ID from it
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Cards */}
            {tokens && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="/generate" className="p-6 rounded-lg border bg-card hover:border-primary transition-colors">
                  <h3 className="text-lg font-semibold mb-2">Generate Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Transform your design into production-ready components with AI assistance
                  </p>
                </a>
                <a href="/tokens" className="p-6 rounded-lg border bg-card hover:border-primary transition-colors">
                  <h3 className="text-lg font-semibold mb-2">Design Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage your design system tokens
                  </p>
                </a>
                <a href="/settings" className="p-6 rounded-lg border bg-card hover:border-primary transition-colors">
                  <h3 className="text-lg font-semibold mb-2">Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure API keys and preferences
                  </p>
                </a>
              </div>
            )}

            {/* Extracted Tokens Card */}
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b bg-card">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  <h2 className="font-semibold">Extracted Tokens</h2>
                </div>
                {tokens && (
                  <div className="flex items-center gap-4">
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="css">CSS</option>
                      <option value="scss">SCSS</option>
                      <option value="json">JSON</option>
                      <option value="ts">TypeScript</option>
                    </select>
                    <button
                      onClick={handleExport}
                      disabled={exporting || !tokens}
                      className="inline-flex items-center justify-center rounded-md h-9 px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {exporting ? 'Exporting...' : 'Export'}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-8">
                {!tokens ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No tokens extracted yet. Use the form above to extract tokens from
                    your Figma file.
                  </div>
                ) : (
                  <>
                    {/* Colors */}
                    <TokenSection
                      title="Colors"
                      icon={Paintbrush}
                      isVisible={tokens.colors}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.entries(tokens.colors || {}).map(([name, value]) => (
                          <div key={name} className="space-y-2">
                            <div
                              className="w-full h-12 rounded-md border"
                              style={{ backgroundColor: value }}
                            />
                            <div className="text-xs">
                              <div className="font-medium truncate">{name}</div>
                              <div className="text-muted-foreground">{value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TokenSection>

                    {/* Typography */}
                    <TokenSection
                      title="Typography"
                      icon={Type}
                      isVisible={tokens.typography}
                    >
                      <div className="grid gap-4">
                        {Object.entries(tokens.typography || {}).map(([name, value]) => (
                          <div key={name} className="p-3 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-muted-foreground">{name}</span>
                              <span className="text-xs text-muted-foreground">
                                {value.fontSize} / {value.fontWeight} / {value.lineHeight}
                              </span>
                            </div>
                            <div style={value as any} className="truncate">
                              The quick brown fox
                            </div>
                          </div>
                        ))}
                      </div>
                    </TokenSection>

                    {/* Spacing */}
                    <TokenSection
                      title="Spacing"
                      icon={Box}
                      isVisible={tokens.spacing}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.entries(tokens.spacing || {}).map(([name, value]) => (
                          <div key={name} className="space-y-2">
                            <div className="w-full h-12 rounded-md border bg-primary/10 flex items-center justify-center">
                              <div
                                className="bg-primary"
                                style={{ width: value, height: value }}
                              />
                            </div>
                            <div className="text-xs">
                              <div className="font-medium truncate">{name}</div>
                              <div className="text-muted-foreground">{value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TokenSection>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {showHistory && <VersionHistoryPanel />}
      </div>
    </>
  );
} 