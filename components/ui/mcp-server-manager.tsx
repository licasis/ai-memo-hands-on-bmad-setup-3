// components/ui/mcp-server-manager.tsx
// MCP 서버 관리 컴포넌트
// 현재 프로젝트에 포함된 MCP 서버와 사용 가능한 MCP 서버들을 표시하고 관리

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // 일시적으로 주석 처리
import { CheckCircle, XCircle, FileText, Package, Play, Square, Plus, Code } from 'lucide-react';

import { DEFAULT_MCP_SERVERS } from '@/lib/mcp/config';

interface ServerFileInfo {
  id: string;
  name: string;
  filePath: string;
  exists: boolean;
  tools: string[];
}

interface AvailableServer {
  id: string;
  name: string;
  description: string;
  command: string;
  args: string[];
  tools: string[];
  category: 'local' | 'external';
  installed: boolean;
}

export function MCPServerManager() {
  const [projectServers, setProjectServers] = useState<ServerFileInfo[]>([]);
  const [availableServers, setAvailableServers] = useState<AvailableServer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'project' | 'available'>('project');

  // 프로젝트 내 MCP 서버 파일들 스캔
  useEffect(() => {
    const scanProjectServers = async () => {
      try {
        // 프로젝트 내 서버 파일들을 확인
        const knownServers = [
          {
            id: 'greeting-calculator',
            name: '인사와 계산기 서버',
            filePath: 'lib/mcp/servers/greeting-calculator-server.js',
            tools: ['greeting', 'calculator']
          }
        ];

        const projectServersData: ServerFileInfo[] = [];

        for (const server of knownServers) {
          try {
            // 서버 파일 존재 여부 확인 (실제로는 API로 확인)
            const exists = true; // 실제 구현에서는 파일 존재 여부 확인
            projectServersData.push({
              ...server,
              exists,
              tools: server.tools
            });
          } catch (error) {
            projectServersData.push({
              ...server,
              exists: false,
              tools: server.tools
            });
          }
        }

        setProjectServers(projectServersData);
      } catch (error) {
        console.error('프로젝트 서버 스캔 실패:', error);
      }
    };

    const loadAvailableServers = () => {
      // 사용 가능한 MCP 서버 목록
      const servers: AvailableServer[] = [
        {
          id: 'greeting-calculator',
          name: '인사와 계산기 서버',
          description: '사용자에게 인사를 건네고 간단한 계산을 수행하는 서버',
          command: 'node',
          args: ['lib/mcp/servers/greeting-calculator-server.js'],
          tools: ['greeting', 'calculator'],
          category: 'local',
          installed: true
        },
        {
          id: 'everything-server',
          name: 'Everything Server',
          description: '다양한 AI 도구를 제공하는 범용 MCP 서버',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-everything'],
          tools: ['enhancer', 'summarizer', 'tagger', 'grammar', 'search', 'web-search'],
          category: 'external',
          installed: false // 실제로는 설치 여부 확인 필요
        },
        {
          id: 'filesystem-server',
          name: 'File System Server',
          description: '파일 시스템 작업을 위한 MCP 서버',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
          tools: ['read_file', 'list_dir', 'search_files'],
          category: 'external',
          installed: false
        },
        {
          id: 'git-server',
          name: 'Git Server',
          description: 'Git 저장소 작업을 위한 MCP 서버',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-git', '--repository', '.'],
          tools: ['git_status', 'git_log', 'git_diff'],
          category: 'external',
          installed: false
        },
        {
          id: 'sqlite-server',
          name: 'SQLite Server',
          description: 'SQLite 데이터베이스 작업을 위한 MCP 서버',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-sqlite', '--db-path', 'data.db'],
          tools: ['query', 'schema', 'tables'],
          category: 'external',
          installed: false
        }
      ];

      setAvailableServers(servers);
      setLoading(false);
    };

    scanProjectServers();
    loadAvailableServers();
  }, []);

  // JSON 유효성 검사
  const validateJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      // 필수 필드 검사
      if (!parsed.id || !parsed.name || !parsed.command) {
        setJsonError('필수 필드 누락: id, name, command');
        return false;
      }
      setJsonError('');
      return true;
    } catch (error) {
      setJsonError('유효하지 않은 JSON 형식입니다.');
      return false;
    }
  };

  // 서버 추가 (시뮬레이션)
  const handleAddServer = () => {
    if (!validateJson(jsonInput)) return;

    alert('MCP 서버 추가 기능은 추후 구현 예정입니다.\n\n입력된 JSON:\n' + jsonInput);
    setJsonInput('');
    setIsAddDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">MCP 서버 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">MCP 서버 관리</h2>
          <p className="text-gray-600 mt-1">
            현재 프로젝트에 포함된 MCP 서버와 사용 가능한 서버들을 관리합니다.
          </p>
        </div>
        <Badge variant="outline">
          프로젝트: {projectServers.filter(s => s.exists).length}개 | 전체: {availableServers.length}개
        </Badge>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'project'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            프로젝트 내 서버 ({projectServers.filter(s => s.exists).length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="w-4 h-4" />
            사용 가능한 서버 ({availableServers.length})
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="py-6">
        {activeTab === 'project' && (
          <div className="grid gap-4">
            {projectServers.map((server) => (
              <Card key={server.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {server.exists ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{server.name}</CardTitle>
                        <p className="text-sm text-gray-600">{server.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={server.exists ? "default" : "secondary"}>
                        {server.exists ? "설치됨" : "없음"}
                      </Badge>
                      <Badge variant="outline">로컬</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">파일 경로:</span>
                      <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                        {server.filePath}
                      </code>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium text-gray-700">제공 도구:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {server.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={!server.exists}
                      >
                        <Play className="w-3 h-3" />
                        서버 시작
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-3 h-3" />
                        파일 보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {projectServers.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    프로젝트 내 MCP 서버 없음
                  </h3>
                  <p className="text-gray-600">
                    lib/mcp/servers/ 디렉토리에 MCP 서버 파일을 추가하세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="grid gap-4">
            {availableServers.map((server) => (
              <Card key={server.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {server.installed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{server.name}</CardTitle>
                        <p className="text-sm text-gray-600">{server.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={server.installed ? "default" : "secondary"}>
                        {server.installed ? "설치됨" : "미설치"}
                      </Badge>
                      <Badge variant="outline">
                        {server.category === 'local' ? '프로젝트 내' : '외부 패키지'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">명령어:</span>
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                          {server.command}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">인자:</span>
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs truncate">
                          {server.args.join(' ')}
                        </code>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium text-gray-700">제공 도구:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {server.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {!server.installed && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Package className="w-3 h-3" />
                          설치
                        </Button>
                      )}
                      {server.installed && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Play className="w-3 h-3" />
                            시작
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Square className="w-3 h-3" />
                            중지
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Code className="w-3 h-3" />
                        설정
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 서버 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            사용자 정의 서버 추가
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>MCP 서버 추가 (JSON)</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                서버 설정 JSON
              </label>
              <Textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  if (jsonError) validateJson(e.target.value);
                }}
                placeholder={`예시:
{
  "id": "my-server",
  "name": "My Custom Server",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-everything", "custom"],
  "disabled": false
}`}
                className="font-mono text-sm min-h-[200px]"
              />
              {jsonError && (
                <p className="text-sm text-red-600 mt-1">{jsonError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setJsonInput('');
                  setJsonError('');
                  setIsAddDialogOpen(false);
                }}
              >
                취소
              </Button>
              <Button onClick={handleAddServer}>
                추가
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}