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
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Note } from '@/lib/db/types';
import { DeleteConfirmDialog } from './delete-confirm-dialog';

interface NoteDetailProps {
  note: Note;
}

export function NoteDetail({ note }: NoteDetailProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {note.title}
            </h1>
            
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
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {note.content}
              </div>
            </div>
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
