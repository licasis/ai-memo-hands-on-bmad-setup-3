// app/dashboard/mcp-servers/page.tsx
// MCP 서버 관리 페이지
// MCP 서버들을 JSON 형식으로 추가, 편집, 삭제하고 연결 상태를 관리하는 페이지입니다
// 관련 파일: lib/mcp/config.ts, lib/mcp/client.ts, components/ui/mcp-server-manager.tsx

import { Metadata } from 'next';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { MCPServerManager } from '@/components/ui/mcp-server-manager';

export const metadata: Metadata = {
  title: 'MCP 서버 관리',
  description: 'Model Context Protocol 서버들을 관리하고 설정합니다.',
};

export default function MCPServersPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MCP 서버 관리
            </h1>
            <p className="text-gray-600">
              AI 도구와 외부 서비스를 제공하는 MCP 서버들을 JSON 형식으로 추가하고 관리합니다.
            </p>
          </div>

          <MCPServerManager />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
