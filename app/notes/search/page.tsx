// app/notes/search/page.tsx
// 노트 검색 페이지
// 사용자가 노트를 검색하고 필터링할 수 있는 페이지
// 관련 파일: components/notes/search-form.tsx, lib/db/queries/notes.ts

import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

export default function NotesSearchPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">노트 검색</h1>
          <p className="text-gray-600">
            원하는 내용을 검색하고 필터링하세요.
          </p>
        </div>

        {/* 검색 폼 */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="노트 제목이나 내용을 검색하세요..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
          </div>
        </Card>

        {/* 검색 결과 */}
        <div className="space-y-4">
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색어를 입력하세요</h3>
            <p className="text-gray-600">
              위의 검색창에 원하는 키워드를 입력하여 노트를 찾아보세요.
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
