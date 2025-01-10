import React from 'react';
import { FigmaViewer } from '@/components/FigmaViewer';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Figma Design Token Extractor
      </h1>
      <FigmaViewer />
    </div>
  );
} 