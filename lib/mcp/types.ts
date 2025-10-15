// lib/mcp/types.ts
// MCP 클라이언트 관련 타입 정의
// MCP 프로토콜을 위한 타입들과 인터페이스 정의

import { Tool, Resource, Prompt, LoggingLevel } from '@modelcontextprotocol/sdk/types.js';

// MCP 클라이언트 상태
export interface MCPClientState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  availableTools: Tool[];
  availableResources: Resource[];
  availablePrompts: Prompt[];
  lastActivity: Date | null;
}

// MCP 서버 설정
export interface MCPServerConfig {
  id: string;
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  disabled?: boolean;
}

// MCP 도구 실행 결과
export interface MCPToolResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
}

// MCP 리소스 내용
export interface MCPResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

// MCP 클라이언트 옵션
export interface MCPClientOptions {
  servers: MCPServerConfig[];
  timeout: number;
  retryAttempts: number;
  loggingLevel: LoggingLevel;
}

// 메모장 앱용 MCP 통합 인터페이스
export interface MCPNoteIntegration {
  // 노트 생성 시 AI 도움
  enhanceNoteContent: (content: string, context?: string) => Promise<string>;
  // 노트 요약 생성
  generateNoteSummary: (content: string) => Promise<string>;
  // 태그 추천
  suggestTags: (content: string, existingTags?: string[]) => Promise<string[]>;
  // 노트 검색 개선
  enhanceSearchQuery: (query: string) => Promise<string>;
  // 맞춤법 및 문법 검사
  checkGrammar: (content: string) => Promise<{
    corrected: string;
    suggestions: Array<{ type: string; message: string; position: number }>;
  }>;
}

// MCP 이벤트 타입
export type MCPEventType =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'tool_executed'
  | 'resource_accessed'
  | 'prompt_used';

// MCP 이벤트
export interface MCPEvent {
  type: MCPEventType;
  timestamp: Date;
  data?: any;
  serverId?: string;
}
