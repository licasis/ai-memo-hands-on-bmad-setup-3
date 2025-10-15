// lib/hooks/use-mcp.ts
// MCP 클라이언트를 위한 React 훅
// React 컴포넌트에서 MCP 기능을 쉽게 사용할 수 있도록 하는 커스텀 훅

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MCPClient } from '../mcp/client';
import { MCPClientState, MCPClientOptions, MCPToolResult, MCPResourceContent, MCPEvent } from '../mcp/types';

export function useMCP(options: MCPClientOptions) {
  const [state, setState] = useState<MCPClientState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    availableTools: [],
    availableResources: [],
    availablePrompts: [],
    lastActivity: null,
  });

  const clientRef = useRef<MCPClient | null>(null);

  // MCP 클라이언트 초기화
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new MCPClient(options);

      // 이벤트 리스너 설정
      const unsubscribe = clientRef.current.onEvent((event: MCPEvent) => {
        setState(prevState => ({
          ...prevState,
          ...clientRef.current?.getState(),
        }));
      });

      return unsubscribe;
    }
  }, [options]);

  // 연결
  const connect = useCallback(async (serverId?: string) => {
    if (!clientRef.current) return;

    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      await clientRef.current.connect(serverId);
      setState(prev => ({ ...prev, ...clientRef.current?.getState() }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage
      }));
    }
  }, []);

  // 연결 해제
  const disconnect = useCallback(async (serverId?: string) => {
    if (!clientRef.current) return;

    try {
      await clientRef.current.disconnect(serverId);
      setState(prev => ({ ...prev, ...clientRef.current?.getState() }));
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }, []);

  // 도구 실행
  const executeTool = useCallback(async (
    serverId: string,
    toolName: string,
    args: Record<string, any> = {}
  ): Promise<MCPToolResult> => {
    if (!clientRef.current) {
      return {
        success: false,
        error: 'MCP client not initialized',
        executionTime: 0,
      };
    }

    return await clientRef.current.executeTool(serverId, toolName, args);
  }, []);

  // 리소스 읽기
  const readResource = useCallback(async (
    serverId: string,
    uri: string
  ): Promise<MCPResourceContent[]> => {
    if (!clientRef.current) {
      throw new Error('MCP client not initialized');
    }

    return await clientRef.current.readResource(serverId, uri);
  }, []);

  // 프롬프트 가져오기
  const getPrompt = useCallback(async (
    serverId: string,
    promptName: string,
    args: Record<string, any> = {}
  ) => {
    if (!clientRef.current) {
      throw new Error('MCP client not initialized');
    }

    return await clientRef.current.getPrompt(serverId, promptName, args);
  }, []);

  // 연결된 서버 목록
  const getConnectedServers = useCallback(() => {
    return clientRef.current?.getConnectedServers() || [];
  }, []);

  return {
    // 상태
    ...state,

    // 액션
    connect,
    disconnect,
    executeTool,
    readResource,
    getPrompt,
    getConnectedServers,
  };
}
