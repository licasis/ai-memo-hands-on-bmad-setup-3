// lib/mcp/client.ts
// MCP 클라이언트 구현
// MCP 서버와의 연결 및 통신을 담당하는 클라이언트 클래스

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import {
  CallToolRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  MCPClientState,
  MCPServerConfig,
  MCPClientOptions,
  MCPToolResult,
  MCPResourceContent,
  MCPEvent,
  MCPEventType,
} from './types.js';

export class MCPClient {
  private clients: Map<string, Client> = new Map();
  private transports: Map<string, StdioClientTransport | SSEClientTransport> = new Map();
  private state: MCPClientState = {
    isConnected: false,
    isConnecting: false,
    error: null,
    availableTools: [],
    availableResources: [],
    availablePrompts: [],
    lastActivity: null,
  };
  private eventListeners: Array<(event: MCPEvent) => void> = [];
  private options: MCPClientOptions;

  constructor(options: MCPClientOptions) {
    this.options = options;
  }

  // 이벤트 리스너 등록
  onEvent(listener: (event: MCPEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  // 이벤트 발생
  private emitEvent(type: MCPEventType, data?: any, serverId?: string): void {
    const event: MCPEvent = {
      type,
      timestamp: new Date(),
      data,
      serverId,
    };
    this.eventListeners.forEach(listener => listener(event));
  }

  // 서버 연결
  async connect(serverId?: string): Promise<void> {
    const serversToConnect = serverId
      ? [this.options.servers.find(s => s.id === serverId)].filter(Boolean)
      : this.options.servers.filter(s => !s.disabled);

    if (serversToConnect.length === 0) {
      throw new Error('No servers to connect');
    }

    this.state.isConnecting = true;
    this.state.error = null;

    try {
      for (const server of serversToConnect) {
        if (!server) continue;

        console.log(`Connecting to MCP server: ${server.name}`, {
          command: server.command,
          args: server.args
        });

        // Stdio 전송 생성 (대부분의 MCP 서버가 Stdio를 사용)
        const transport = new StdioClientTransport({
          command: server.command,
          args: server.args,
          env: { ...process.env, ...server.env },
        });

        console.log('StdioClientTransport created');

        // 클라이언트 생성
        const client = new Client(
          {
            name: 'ai-memo-mcp-client',
            version: '1.0.0',
          },
          {
            capabilities: {},
          }
        );

        console.log('Client created, attempting to connect...');

        // 연결 및 초기화
        await client.connect(transport);

        console.log('Client connected successfully');

        // 서버 정보 저장
        this.clients.set(server.id, client);
        this.transports.set(server.id, transport);

        console.log(`Connected to MCP server: ${server.name}`);

        // 사용 가능한 도구, 리소스, 프롬프트 로드
        await this.loadServerCapabilities(server.id);

        this.emitEvent('connected', { serverId: server.id, serverName: server.name });
      }

      this.state.isConnected = true;
      this.state.isConnecting = false;
      this.state.lastActivity = new Date();

    } catch (error) {
      this.state.isConnecting = false;
      this.state.error = error instanceof Error ? error.message : 'Connection failed';
      this.emitEvent('error', { error: this.state.error });
      throw error;
    }
  }

  // 서버 연결 해제
  async disconnect(serverId?: string): Promise<void> {
    const serverIds = serverId ? [serverId] : Array.from(this.clients.keys());

    for (const id of serverIds) {
      const client = this.clients.get(id);
      const transport = this.transports.get(id);

      if (client) {
        try {
          await client.close();
          this.clients.delete(id);
          this.emitEvent('disconnected', { serverId: id });
        } catch (error) {
          console.error(`Error disconnecting from server ${id}:`, error);
        }
      }

      if (transport) {
        this.transports.delete(id);
      }
    }

    if (this.clients.size === 0) {
      this.state.isConnected = false;
    }
  }

  // 서버 기능 로드
  private async loadServerCapabilities(serverId: string): Promise<void> {
    const client = this.clients.get(serverId);
    if (!client) return;

    try {
      // 도구 목록 로드
      const toolsResponse = await client.request(
        { method: 'tools/list' },
        { timeout: this.options.timeout }
      );
      if (toolsResponse.tools) {
        this.state.availableTools.push(...toolsResponse.tools);
      }

      // 리소스 목록 로드
      const resourcesResponse = await client.request(
        { method: 'resources/list' },
        { timeout: this.options.timeout }
      );
      if (resourcesResponse.resources) {
        this.state.availableResources.push(...resourcesResponse.resources);
      }

      // 프롬프트 목록 로드
      const promptsResponse = await client.request(
        { method: 'prompts/list' },
        { timeout: this.options.timeout }
      );
      if (promptsResponse.prompts) {
        this.state.availablePrompts.push(...promptsResponse.prompts);
      }

    } catch (error) {
      console.error(`Error loading capabilities for server ${serverId}:`, error);
    }
  }

  // 도구 실행
  async executeTool(serverId: string, toolName: string, args: Record<string, any> = {}): Promise<MCPToolResult> {
    const client = this.clients.get(serverId);
    if (!client) {
      throw new Error(`Server ${serverId} not connected`);
    }

    const startTime = Date.now();

    try {
      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args,
          },
        },
        CallToolRequestSchema,
        { timeout: this.options.timeout }
      );

      this.state.lastActivity = new Date();
      this.emitEvent('tool_executed', { toolName, args, result: response }, serverId);

      return {
        success: true,
        result: response,
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Tool execution failed';

      this.emitEvent('error', { toolName, args, error: errorMessage }, serverId);

      return {
        success: false,
        error: errorMessage,
        executionTime,
      };
    }
  }

  // 리소스 읽기
  async readResource(serverId: string, uri: string): Promise<MCPResourceContent[]> {
    const client = this.clients.get(serverId);
    if (!client) {
      throw new Error(`Server ${serverId} not connected`);
    }

    try {
      const response = await client.request(
        {
          method: 'resources/read',
          params: { uri },
        },
        ReadResourceRequestSchema,
        { timeout: this.options.timeout }
      );

      this.state.lastActivity = new Date();
      this.emitEvent('resource_accessed', { uri, contents: response.contents }, serverId);

      return response.contents || [];

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Resource read failed';
      this.emitEvent('error', { uri, error: errorMessage }, serverId);
      throw error;
    }
  }

  // 프롬프트 가져오기
  async getPrompt(serverId: string, promptName: string, args: Record<string, any> = {}): Promise<any> {
    const client = this.clients.get(serverId);
    if (!client) {
      throw new Error(`Server ${serverId} not connected`);
    }

    try {
      const response = await client.request(
        {
          method: 'prompts/get',
          params: {
            name: promptName,
            arguments: args,
          },
        },
        GetPromptRequestSchema,
        { timeout: this.options.timeout }
      );

      this.state.lastActivity = new Date();
      this.emitEvent('prompt_used', { promptName, args, messages: response.messages }, serverId);

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Prompt retrieval failed';
      this.emitEvent('error', { promptName, args, error: errorMessage }, serverId);
      throw error;
    }
  }

  // 현재 상태 가져오기
  getState(): MCPClientState {
    return { ...this.state };
  }

  // 연결된 서버 목록
  getConnectedServers(): string[] {
    return Array.from(this.clients.keys());
  }

  // 특정 서버의 클라이언트 가져오기
  getClient(serverId: string): Client | undefined {
    return this.clients.get(serverId);
  }
}
