// components/notes/note-detail.tsx
// 노트 상세 조회 컴포넌트
// 노트의 전체 내용을 표시하고 액션 버튼을 제공하는 컴포넌트
// 관련 파일: app/notes/[id]/page.tsx, components/notes/delete-confirm-dialog.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Check, Square } from 'lucide-react';
import { Note } from '@/lib/db/types';
import { DeleteConfirmDialog } from './delete-confirm-dialog';
import { AISummaryButton } from './ai-summary-button';
import { AITagButton } from './ai-tag-button';
// HTML 콘텐츠를 직접 렌더링

interface NoteDetailProps {
  note: Note;
}

export function NoteDetail({ note }: NoteDetailProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(note.isChecked || false);
  const [isToggling, setIsToggling] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
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

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/notes/${note.id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/notes');
      } else {
        console.error('삭제 실패');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          
          <div className="flex items-center gap-2">
            <AISummaryButton
              noteId={note.id}
              noteTitle={note.title}
              noteContent={note.content}
            />
            <AITagButton
              noteId={note.id}
              noteTitle={note.title}
              noteContent={note.content}
            />
            <Button
              variant="outline"
              onClick={handleEdit}
              className="inline-flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              수정
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </Button>
          </div>
        </div>

        {/* 노트 내용 */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Reviewed</span>
                <button
                  onClick={handleToggleCheck}
                  disabled={isToggling}
                  className={`p-2 rounded transition-colors ${
                    isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Reviewed"
                >
                  {isChecked ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Square className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <h1 className={`text-3xl font-bold flex-1 ${
                isChecked ? 'text-gray-500' : 'text-gray-900'
              }`}>
                {note.title}
              </h1>
            </div>
            
            {/* 메타데이터 */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>작성일: {formatDate(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>수정일: {formatDate(note.updatedAt)}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: note.content.replace(
                  /<span style="color: rgb\((\d+), (\d+), (\d+)\);">/g,
                  '<span style="color: rgb($1, $2, $3) !important;">'
                )
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        noteTitle={note.title}
      />
    </>
  );
}
