// lib/mcp/index.ts
// MCP 모듈 메인 export 파일
// MCP 관련 모든 기능들을 하나의 인터페이스로 제공

export { MCPClient } from './client';
export { createMCPNoteIntegration } from './note-integration';
export { getMCPConfig, DEFAULT_MCP_OPTIONS } from './config';

export type {
  MCPClientState,
  MCPServerConfig,
  MCPClientOptions,
  MCPToolResult,
  MCPResourceContent,
  MCPNoteIntegration,
  MCPEvent,
  MCPEventType,
} from './types';

// 편의를 위한 기본 export
export { useMCP } from '../hooks/use-mcp';

// MCP 클라이언트 인스턴스 생성 헬퍼 함수
import { MCPClient } from './client';
import { getMCPConfig } from './config';
import { createMCPNoteIntegration } from './note-integration';

export function createMCPClient() {
  const config = getMCPConfig();
  const client = new MCPClient(config);
  const noteIntegration = createMCPNoteIntegration(client);

  return {
    client,
    noteIntegration,
    config,
  };
}
