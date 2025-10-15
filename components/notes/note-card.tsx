// components/notes/note-card.tsx
// 노트 카드 컴포넌트
// 개별 노트를 카드 형태로 표시하는 재사용 가능한 컴포넌트
// 관련 파일: app/notes/page.tsx, components/ui/card.tsx

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Note } from '@/lib/db/types';
import { useState } from 'react';
import { Check, Square } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  showActions?: boolean;
}

export function NoteCard({ note, showActions = true }: NoteCardProps) {
  const [isChecked, setIsChecked] = useState(note.isChecked || false);
  const [isToggling, setIsToggling] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleToggleCheck = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      const response = await fetch(`/api/notes/${note.id}/toggle-check`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isChecked: !isChecked,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsChecked(!isChecked);
      } else {
        console.error('체크 상태 변경 실패:', data.error);
      }
    } catch (error) {
      console.error('체크 상태 변경 오류:', error);
    } finally {
      setIsToggling(false);
    }
  };


  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Reviewed</span>
              <button
                onClick={handleToggleCheck}
                disabled={isToggling}
                className={`p-1 rounded transition-colors ${
                  isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                aria-label="Reviewed"
              >
                {isChecked ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <h3 className={`text-lg font-semibold line-clamp-2 flex-1 ${
              isChecked ? 'text-gray-500' : 'text-gray-900'
            }`}>
              {note.title}
            </h3>
          </div>
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
        <div 
          className="text-gray-600 text-sm mb-3 line-clamp-3"
          dangerouslySetInnerHTML={{ 
            __html: note.content
              .replace(/<span style="color: rgb\((\d+), (\d+), (\d+)\);">/g, '<span style="color: rgb($1, $2, $3) !important;">')
              .replace(/<mark data-color="([^"]*)" style="background-color: rgb\((\d+), (\d+), (\d+)\); color: inherit;">/g, '<mark style="background-color: rgb($2, $3, $4) !important;">')
          }}
        />
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>작성: {formatDate(note.createdAt)}</span>
          <span>수정: {formatDate(note.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
