// lib/mcp/config.ts
// MCP 클라이언트 설정
// MCP 서버 연결 및 클라이언트 설정을 정의

import { MCPServerConfig, MCPClientOptions, LoggingLevel } from './types';

// 기본 MCP 서버 설정
export const DEFAULT_MCP_SERVERS: MCPServerConfig[] = [
  {
    id: 'note-enhancer',
    name: 'Note Enhancer',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'enhancer'],
    disabled: false,
  },
  {
    id: 'note-summarizer',
    name: 'Note Summarizer',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'summarizer'],
    disabled: false,
  },
  {
    id: 'tag-suggester',
    name: 'Tag Suggester',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'tagger'],
    disabled: false,
  },
  {
    id: 'grammar-checker',
    name: 'Grammar Checker',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'grammar'],
    disabled: false,
  },
  {
    id: 'search-enhancer',
    name: 'Search Enhancer',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'search'],
    disabled: false,
  },
  {
    id: 'web-search',
    name: 'Web Search',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'web-search'],
    disabled: true, // 기본적으로 비활성화 (API 키 필요)
  },
  {
    id: 'template-suggester',
    name: 'Template Suggester',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'templates'],
    disabled: false,
  },
  {
    id: 'priority-analyzer',
    name: 'Priority Analyzer',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything', 'priority'],
    disabled: false,
  },
];

// MCP 클라이언트 기본 설정
export const DEFAULT_MCP_OPTIONS: MCPClientOptions = {
  servers: DEFAULT_MCP_SERVERS,
  timeout: 30000, // 30초
  retryAttempts: 3,
  loggingLevel: 'info' as LoggingLevel,
};

// 환경변수에서 MCP 설정 로드
export function loadMCPConfigFromEnv(): MCPClientOptions {
  const servers = [...DEFAULT_MCP_SERVERS];

  // 환경변수에서 추가 서버 설정 로드
  const customServers = process.env.MCP_CUSTOM_SERVERS;
  if (customServers) {
    try {
      const parsed = JSON.parse(customServers);
      if (Array.isArray(parsed)) {
        servers.push(...parsed);
      }
    } catch (error) {
      console.warn('Failed to parse MCP_CUSTOM_SERVERS:', error);
    }
  }

  // 개별 서버 활성화/비활성화 설정
  servers.forEach(server => {
    const enabled = process.env[`MCP_${server.id.toUpperCase()}_ENABLED`];
    if (enabled !== undefined) {
      server.disabled = enabled !== 'true';
    }
  });

  return {
    servers,
    timeout: parseInt(process.env.MCP_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.MCP_RETRY_ATTEMPTS || '3'),
    loggingLevel: (process.env.MCP_LOG_LEVEL as LoggingLevel) || 'info',
  };
}

// 개발 환경용 설정
export const DEVELOPMENT_MCP_OPTIONS: MCPClientOptions = {
  servers: DEFAULT_MCP_SERVERS.filter(server =>
    ['note-enhancer', 'tag-suggester', 'grammar-checker'].includes(server.id)
  ),
  timeout: 15000,
  retryAttempts: 2,
  loggingLevel: 'debug' as LoggingLevel,
};

// 프로덕션 환경용 설정
export const PRODUCTION_MCP_OPTIONS: MCPClientOptions = {
  servers: DEFAULT_MCP_SERVERS.filter(server => !server.disabled),
  timeout: 45000,
  retryAttempts: 5,
  loggingLevel: 'warn' as LoggingLevel,
};

// 현재 환경에 맞는 설정 반환
export function getMCPConfig(): MCPClientOptions {
  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_MCP_OPTIONS;
  }

  // 환경변수에서 설정을 로드하거나 개발 환경 기본 설정 사용
  return loadMCPConfigFromEnv();
}
