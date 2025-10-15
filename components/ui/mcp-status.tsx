// components/ui/mcp-status.tsx
// MCP 연결 상태를 표시하는 컴포넌트

'use client';

import { useState, useEffect } from 'react';
import { Cpu, Wifi, WifiOff, Loader2 } from 'lucide-react';

export function MCPStatus() {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    toolCount: number;
  }>({
    isConnected: false,
    isConnecting: false,
    error: null,
    toolCount: 0,
  });

  useEffect(() => {
    // 간단한 상태 표시를 위해 하드코딩된 값 사용
    // 실제로는 useMCP 훅을 사용할 수 있지만, 여기서는 간단하게 표시
    setStatus({
      isConnected: false, // 실제 MCP 서버 연결 상태
      isConnecting: false,
      error: null,
      toolCount: 0,
    });
  }, []);

  const { isConnected, isConnecting, error, toolCount } = status;

  const getStatusIcon = () => {
    if (isConnecting) {
      return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
    }
    if (isConnected) {
      return <Wifi className="w-4 h-4 text-green-500" />;
    }
    return <WifiOff className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (isConnecting) return 'AI 연결 중...';
    if (isConnected) return `AI 연결됨 (${toolCount}개 도구)`;
    return 'AI 준비중';
  };

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-600';
    if (isConnected) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <Cpu className="w-4 h-4 text-gray-400" />
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {error && (
        <span className="text-xs text-red-500 ml-2" title={error}>
          오류
        </span>
      )}
    </div>
  );
}
