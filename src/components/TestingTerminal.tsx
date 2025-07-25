'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TerminalLog } from '@/types/walletdash-api';
import { X, Terminal, ChevronDown, ChevronUp, Copy, Download, Trash2 } from 'lucide-react';

interface TestingTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TestingTerminal({ isOpen, onClose }: TestingTerminalProps) {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'api' | 'database' | 'blockchain' | 'error'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Add new log entry
  const addLog = (log: TerminalLog) => {
    setLogs(prev => [...prev, { ...log, id: `log-${Date.now()}-${Math.random()}` }]);
  };

  // Filter logs based on current filter
  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  // Get log type styling
  const getLogTypeStyle = (type: TerminalLog['type']) => {
    switch (type) {
      case 'api':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'database':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'blockchain':
        return 'text-purple-400 bg-purple-900/20 border-purple-500/30';
      case 'success':
        return 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30';
      case 'error':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'info':
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  // Get log icon
  const getLogIcon = (type: TerminalLog['type']) => {
    switch (type) {
      case 'api':
        return '🌐';
      case 'database':
        return '💾';
      case 'blockchain':
        return '⛓️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  // Copy log to clipboard
  const copyLog = (log: TerminalLog) => {
    const logText = `[${log.timestamp}] ${log.title}\n${JSON.stringify(log.details, null, 2)}`;
    navigator.clipboard.writeText(logText);
  };

  // Export logs as JSON
  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `meddefi-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Format duration
  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    return `(${duration}ms)`;
  };

  // Expose addLog function globally for services to use
  useEffect(() => {
    // @ts-ignore
    window.addTerminalLog = addLog;
    
    return () => {
      // @ts-ignore
      delete window.addTerminalLog;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div 
        ref={terminalRef}
        className={`w-full max-w-6xl bg-gray-900 border border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[600px]'
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">MedDefi Debug Terminal</h2>
            <span className="text-sm text-gray-400">({logs.length} logs)</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex bg-gray-700 rounded-md overflow-hidden">
              {(['all', 'api', 'database', 'blockchain', 'error'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filterType.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Control Buttons */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`p-2 rounded transition-colors ${
                autoScroll ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Auto-scroll"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={exportLogs}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              title="Export logs"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={clearLogs}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-red-600 transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        {!isMinimized && (
          <div className="h-[calc(100%-80px)] overflow-y-auto p-4 space-y-2 font-mono text-sm">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No logs yet. Start using the application to see API calls and database operations.</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded border-l-4 ${getLogTypeStyle(log.type)} group`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Log Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getLogIcon(log.type)}</span>
                        <span className="font-medium text-white">{log.title}</span>
                        {log.duration && (
                          <span className="text-xs text-gray-400">{formatDuration(log.duration)}</span>
                        )}
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Log Details */}
                      <div className="bg-black/30 rounded p-3 overflow-x-auto">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
                          {typeof log.details === 'string' 
                            ? log.details 
                            : JSON.stringify(log.details, null, 2)
                          }
                        </pre>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => copyLog(log)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all"
                      title="Copy log"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        )}

        {/* Status Bar */}
        <div className="h-8 px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>Logs: {logs.length}</span>
            <span>Filtered: {filteredLogs.length}</span>
            <span className={`flex items-center gap-1 ${autoScroll ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${autoScroll ? 'bg-green-400' : 'bg-gray-400'}`} />
              Auto-scroll
            </span>
          </div>
          <div className="text-gray-500">
            MedDefi MVP Debug Terminal v1.0
          </div>
        </div>
      </div>
    </div>
  );
}

// Global log functions for easy access
export const addTerminalLog = (log: Omit<TerminalLog, 'id'>) => {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.addTerminalLog) {
    // @ts-ignore
    window.addTerminalLog({ ...log, id: `log-${Date.now()}-${Math.random()}` });
  }
};

export const logInfo = (title: string, details: any) => {
  addTerminalLog({
    timestamp: new Date().toISOString(),
    type: 'info',
    title,
    details
  });
};

export const logSuccess = (title: string, details: any, duration?: number) => {
  addTerminalLog({
    timestamp: new Date().toISOString(),
    type: 'success',
    title,
    details,
    duration
  });
};

export const logError = (title: string, details: any, duration?: number) => {
  addTerminalLog({
    timestamp: new Date().toISOString(),
    type: 'error',
    title,
    details,
    duration
  });
};

export const logApi = (title: string, details: any, duration?: number) => {
  addTerminalLog({
    timestamp: new Date().toISOString(),
    type: 'api',
    title,
    details,
    duration
  });
};

export const logDatabase = (title: string, details: any, duration?: number) => {
  addTerminalLog({
    timestamp: new Date().toISOString(),
    type: 'database',
    title,
    details,
    duration
  });
};

export const logBlockchain = (title: string, details: any, duration?: number) => {
  addTerminalLog({
    timestamp: new Date().toISOString(),
    type: 'blockchain',
    title,
    details,
    duration
  });
}; 