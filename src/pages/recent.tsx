import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { File, Clock, ExternalLink, Trash2 } from 'lucide-react';

interface RecentFile {
  id: string;
  name: string;
  url: string;
  accessedAt: Date;
}

export default function RecentPage() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    // Load recent files from localStorage
    const loadRecentFiles = () => {
      try {
        const saved = localStorage.getItem('recentFigmaFiles');
        if (saved) {
          const files = JSON.parse(saved);
          setRecentFiles(files.map((f: any) => ({
            ...f,
            accessedAt: new Date(f.accessedAt)
          })));
        }
      } catch (err) {
        console.error('Failed to load recent files:', err);
      }
    };

    loadRecentFiles();
  }, []);

  const removeFile = (id: string) => {
    const updated = recentFiles.filter(f => f.id !== id);
    setRecentFiles(updated);
    localStorage.setItem('recentFigmaFiles', JSON.stringify(updated));
  };

  return (
    <>
      <Head>
        <title>Recent Files - AI System Prototype</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recent Files</h1>
          <p className="text-muted-foreground">
            View and manage your recently accessed Figma files
          </p>
        </div>

        <div className="grid gap-6">
          {recentFiles.length === 0 ? (
            <div className="rounded-lg border bg-card text-card-foreground p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No Recent Files</h3>
              <p className="text-sm text-muted-foreground">
                Files you extract tokens from will appear here
              </p>
            </div>
          ) : (
            recentFiles.map((file) => (
              <div
                key={file.id}
                className="rounded-lg border bg-card text-card-foreground p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <File className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last accessed {file.accessedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 hover:bg-accent rounded-md"
                    title="Open in Figma"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 hover:bg-accent rounded-md text-destructive"
                    title="Remove from recent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
} 