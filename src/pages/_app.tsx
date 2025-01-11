import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import { MainLayout } from '@/components/layout/MainLayout';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ThemeProvider>
  );
} 