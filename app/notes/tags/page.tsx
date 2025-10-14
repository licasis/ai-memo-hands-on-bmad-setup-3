// app/notes/tags/page.tsx
// 태그 관리 페이지
// 사용자가 노트 태그를 관리하고 정리할 수 있는 페이지
// 관련 파일: lib/db/queries/tags.ts, components/notes/tag-manager.tsx

import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

export default function TagsPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">태그 관리</h1>
          <p className="text-gray-600">
            노트에 사용할 태그를 생성하고 관리하세요.
          </p>
        </div>

        {/* 새 태그 추가 */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="새 태그 이름을 입력하세요..."
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              태그 추가
            </Button>
          </div>
        </Card>

        {/* 태그 목록 */}
        <div className="space-y-4">
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 태그가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              첫 번째 태그를 생성하여 노트를 정리해보세요.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              첫 태그 만들기
            </Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
