import React from 'react';
import Head from 'next/head';
import { Code, Paintbrush, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>AI Design Transformer - Design to Code</title>
      </Head>

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Design Transformer</h1>
            <p className="text-muted-foreground">
              Transform your Figma designs into production-ready code with AI assistance
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Extract Design System Card */}
          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Extract Design System</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your Figma file to extract design tokens and prepare for code generation
                </p>
              </div>
            </div>
            <a 
              href="/tokens"
              className="inline-flex items-center justify-center h-12 px-6 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
            >
              Connect Design
            </a>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Generate Code Card */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Generate Code</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Transform your design into production-ready components with AI assistance
              </p>
              <a 
                href="/generate"
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium bg-accent hover:bg-accent/80 rounded-md transition-colors"
              >
                Open Generator
              </a>
            </div>

            {/* Design Tokens Card */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Paintbrush className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Design Tokens</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                View and manage your design system tokens
              </p>
              <a 
                href="/tokens"
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium bg-accent hover:bg-accent/80 rounded-md transition-colors"
              >
                View Tokens
              </a>
            </div>

            {/* Settings Card */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Settings</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Configure API keys and preferences
              </p>
              <a 
                href="/settings"
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium bg-accent hover:bg-accent/80 rounded-md transition-colors"
              >
                Open Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 