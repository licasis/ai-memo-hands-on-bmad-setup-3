// app/notes/tags/page.tsx
// 태그 관리 페이지
// 사용자가 노트 태그를 관리하고 정리할 수 있는 페이지
// 관련 파일: lib/db/queries/tags.ts, components/notes/tag-manager.tsx

import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { TagManager } from '@/components/notes/tag-manager';

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
        
        <TagManager />
      </div>
    </AuthenticatedLayout>
  );
}
