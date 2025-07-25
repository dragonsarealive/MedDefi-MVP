'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TerminalLog } from '@/types/walletdash-api';
import { X, Terminal, ChevronDown, ChevronUp, Copy, Download, Trash2, Maximize2, Minimize2, Move, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestingTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TerminalMode = 'sidebar' | 'detached' | 'minimized';

export default function TestingTerminal({ isOpen, onClose }: TestingTerminalProps) {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [mode, setMode] = useState<TerminalMode>('sidebar');
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filter, setFilter] = useState<'all' | 'api' | 'database' | 'blockchain' | 'error'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [detachedPosition, setDetachedPosition] = useState({ x: 100, y: 100 });
  const [detachedSize, setDetachedSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const resizeRef = useRef<{ width: number; height: number } | null>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Handle mouse events for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        setDetachedPosition({
          x: e.clientX - dragRef.current.x,
          y: e.clientY - dragRef.current.y
        });
      }
      
      if (isResizing && resizeRef.current) {
        setDetachedSize({
          width: Math.max(400, e.clientX - detachedPosition.x + 20),
          height: Math.max(300, e.clientY - detachedPosition.y + 20)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      dragRef.current = null;
      resizeRef.current = null;
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, detachedPosition.x, detachedPosition.y]);

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

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (mode !== 'detached') return;
    setIsDragging(true);
    dragRef.current = {
      x: e.clientX - detachedPosition.x,
      y: e.clientY - detachedPosition.y
    };
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (mode !== 'detached') return;
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      width: detachedSize.width,
      height: detachedSize.height
    };
  };

  // Toggle between modes
  const toggleMode = () => {
    if (mode === 'sidebar') {
      setMode('detached');
    } else if (mode === 'detached') {
      setMode('minimized');
    } else {
      setMode('sidebar');
    }
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

  // Minimized mode
  if (mode === 'minimized') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMode('sidebar')}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm">Debug Terminal ({logs.length})</span>
        </button>
      </div>
    );
  }

  // Detached window mode
  if (mode === 'detached') {
    return (
      <div
        ref={terminalRef}
        className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
        style={{
          left: detachedPosition.x,
          top: detachedPosition.y,
          width: detachedSize.width,
          height: detachedSize.height,
          minWidth: 400,
          minHeight: 300
        }}
      >
        {/* Draggable Header */}
        <div 
          className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 cursor-move select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-semibold text-white">MedDefi Debug Terminal</h2>
            <span className="text-xs text-gray-400">({logs.length} logs)</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode('sidebar')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Dock to sidebar"
            >
              <Move className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMode('minimized')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Minimize"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-red-600 rounded transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Terminal Controls */}
        <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800/50">
          <div className="flex bg-gray-700 rounded overflow-hidden">
            {(['all', 'api', 'database', 'blockchain', 'error'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-2 py-1 text-xs font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filterType.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`p-1.5 rounded transition-colors ${
                autoScroll ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Auto-scroll"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              onClick={exportLogs}
              className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              title="Export logs"
            >
              <Download className="w-3 h-3" />
            </button>
            <button
              onClick={clearLogs}
              className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-red-600 transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="h-[calc(100%-96px)] overflow-y-auto p-3 space-y-2 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Terminal className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No logs yet. Start using the application to see API calls and database operations.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2 rounded border-l-4 ${getLogTypeStyle(log.type)} group`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{getLogIcon(log.type)}</span>
                      <span className="font-medium text-white text-xs">{log.title}</span>
                      {log.duration && (
                        <span className="text-xs text-gray-400">{formatDuration(log.duration)}</span>
                      )}
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-black/30 rounded p-2 overflow-x-auto">
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
                        {typeof log.details === 'string' 
                          ? log.details 
                          : JSON.stringify(log.details, null, 2)
                        }
                      </pre>
                    </div>
                  </div>
                  <button
                    onClick={() => copyLog(log)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all"
                    title="Copy log"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-gray-600 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        />
      </div>
    );
  }

  // Sidebar mode
  return (
    <div 
      className={`fixed right-0 top-0 h-full z-40 bg-gray-900 border-l border-gray-700 shadow-2xl transition-all duration-300 ${
        isCollapsed ? 'w-12' : `w-[${sidebarWidth}px]`
      }`}
      style={{ width: isCollapsed ? 48 : sidebarWidth }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-semibold text-white">Debug Terminal</h2>
            <span className="text-xs text-gray-400">({logs.length})</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          
          {!isCollapsed && (
            <>
              <button
                onClick={() => setMode('detached')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Detach window"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-red-600 rounded transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Sidebar Controls */}
          <div className="p-2 border-b border-gray-700 bg-gray-800/50">
            <div className="flex flex-wrap gap-1 mb-2">
              {(['all', 'api', 'database', 'blockchain', 'error'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filterType.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`p-1.5 rounded transition-colors ${
                  autoScroll ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title="Auto-scroll"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                onClick={exportLogs}
                className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                title="Export logs"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={clearLogs}
                className="p-1.5 bg-gray-700 text-gray-300 rounded hover:bg-red-600 transition-colors"
                title="Clear logs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="h-[calc(100%-120px)] overflow-y-auto p-2 space-y-1 font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Terminal className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No logs yet</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded border-l-2 ${getLogTypeStyle(log.type)} group`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs">{getLogIcon(log.type)}</span>
                        <span className="font-medium text-white text-xs truncate">{log.title}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(log.timestamp).toLocaleTimeString().slice(-8, -3)}
                        </span>
                      </div>
                      <div className="bg-black/30 rounded p-1 overflow-hidden">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all line-clamp-3">
                          {typeof log.details === 'string' 
                            ? log.details 
                            : JSON.stringify(log.details, null, 2)
                          }
                        </pre>
                      </div>
                    </div>
                    <button
                      onClick={() => copyLog(log)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-white transition-all"
                      title="Copy log"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </>
      )}

      {/* Resize Handle for Sidebar */}
      {!isCollapsed && (
        <div
          className="absolute left-0 top-0 w-1 h-full bg-gray-600 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = sidebarWidth;
            
            const handleMouseMove = (e: MouseEvent) => {
              const diff = startX - e.clientX;
              setSidebarWidth(Math.max(300, Math.min(800, startWidth + diff)));
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      )}
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