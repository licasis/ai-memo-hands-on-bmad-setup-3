// components/notes/empty-state.tsx
// 빈 상태 UI 컴포넌트
// 노트가 없을 때 표시되는 안내 메시지와 액션 버튼
// 관련 파일: app/notes/page.tsx, components/notes/note-list.tsx

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">아직 노트가 없습니다</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        아이디어나 정보를 빠르게 기록하고 저장해보세요.
      </p>
      <Link href="/notes/create">
        <Button className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          새 노트 작성
        </Button>
      </Link>
    </div>
  );
}
