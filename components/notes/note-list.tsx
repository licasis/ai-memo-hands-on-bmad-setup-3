// components/notes/note-list.tsx
// 노트 목록 컨테이너 컴포넌트
// 노트 목록을 표시하고 빈 상태를 처리하는 컴포넌트
// 관련 파일: components/notes/note-card.tsx, app/notes/page.tsx

import { NoteCard } from './note-card';
import { EmptyState } from './empty-state';
import { LoadingSkeleton } from './loading-skeleton';
import { Note } from '@/lib/db/types';

interface NoteListProps {
  notes: Note[];
  isLoading?: boolean;
  error?: string | null;
}

export function NoteList({ notes, isLoading = false, error = null }: NoteListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">노트를 불러올 수 없습니다</h3>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
