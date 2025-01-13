import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');

  // Simulated log data for demonstration
  useEffect(() => {
    const demoLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        level: 'success',
        message: 'Successfully generated React components from design tokens',
        source: 'Code Generator'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        level: 'info',
        message: 'Processing Figma file for token extraction',
        source: 'Token Extractor'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        level: 'warning',
        message: 'Some color tokens were not properly formatted',
        source: 'Token Validator'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        level: 'error',
        message: 'Failed to connect to Figma API',
        source: 'API Client'
      }
    ];

    setLogs(demoLogs);

    // Simulate real-time logs
    const interval = setInterval(() => {
      const levels: LogEntry['level'][] = ['info', 'warning', 'error', 'success'];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: levels[Math.floor(Math.random() * levels.length)],
        message: 'New system activity detected',
        source: 'System Monitor'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter);

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <>
      <Head>
        <title>System Logs - AI System Prototype</title>
      </Head>

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Logs</h1>
          <p className="text-muted-foreground">Monitor system activity and performance metrics in real-time</p>
        </div>

        <div className="grid gap-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['all', 'info', 'warning', 'error', 'success'].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level as any)}
                className={`p-4 rounded-lg border ${
                  filter === level ? 'bg-primary/10 border-primary' : 'bg-card hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">{level}</span>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold">
                  {level === 'all'
                    ? logs.length
                    : logs.filter(log => log.level === level).length}
                </div>
              </button>
            ))}
          </div>

          {/* Log List */}
          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Activity Log</h2>
            </div>
            <div className="divide-y">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-start gap-4">
                  <div className="mt-1">{getLogIcon(log.level)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{log.message}</p>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Source: {log.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 