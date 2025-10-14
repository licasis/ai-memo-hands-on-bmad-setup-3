// components/notes/note-card.tsx
// 노트 카드 컴포넌트
// 개별 노트를 카드 형태로 표시하는 재사용 가능한 컴포넌트
// 관련 파일: app/notes/page.tsx, components/ui/card.tsx

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Note } from '@/lib/db/types';

interface NoteCardProps {
  note: Note;
  showActions?: boolean;
}

export function NoteCard({ note, showActions = true }: NoteCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {note.title}
          </h3>
          {showActions && (
            <Link href={`/notes/${note.id}`}>
              <Button variant="outline" size="sm">
                보기
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {truncateContent(note.content)}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>작성: {formatDate(note.createdAt)}</span>
          <span>수정: {formatDate(note.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
