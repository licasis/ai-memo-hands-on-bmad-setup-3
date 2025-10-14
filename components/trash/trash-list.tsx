// components/trash/trash-list.tsx
// 휴지통 노트 목록 컴포넌트
// 삭제된 노트들을 표시하고 복구/영구삭제 액션을 제공하는 컴포넌트
// 관련 파일: components/trash/trash-note-card.tsx, components/trash/trash-empty-state.tsx

import { TrashNoteCard } from './trash-note-card';
import { TrashEmptyState } from './trash-empty-state';
import { TrashLoadingSkeleton } from './trash-loading-skeleton';

interface TrashListProps {
  notes: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }>;
  isLoading?: boolean;
  error?: string;
}

export function TrashList({ notes, isLoading = false, error }: TrashListProps) {
  if (isLoading) {
    return <TrashLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return <TrashEmptyState />;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <TrashNoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
