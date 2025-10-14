// components/trash/trash-note-card.tsx
// 휴지통 노트 카드 컴포넌트
// 삭제된 노트의 정보를 표시하고 복구/영구삭제 버튼을 제공하는 컴포넌트
// 관련 파일: components/trash/restore-confirm-dialog.tsx, components/trash/permanent-delete-dialog.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RestoreConfirmDialog } from './restore-confirm-dialog';
import { PermanentDeleteDialog } from './permanent-delete-dialog';
import { RotateCcw, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface TrashNoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
}

export function TrashNoteCard({ note }: TrashNoteCardProps) {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getContentPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {note.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive" className="text-xs">
                  삭제됨
                </Badge>
                <span className="text-sm text-gray-500">
                  {note.deletedAt && formatDate(note.deletedAt)}에 삭제
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link href={`/notes/${note.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  보기
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRestoreDialog(true)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                복구
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPermanentDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                영구삭제
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 text-sm leading-relaxed">
            {getContentPreview(note.content)}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              <span>작성: {formatDate(note.createdAt)}</span>
              {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                <span className="ml-3">수정: {formatDate(note.updatedAt)}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <RestoreConfirmDialog
        note={note}
        open={showRestoreDialog}
        onOpenChange={setShowRestoreDialog}
      />

      <PermanentDeleteDialog
        note={note}
        open={showPermanentDeleteDialog}
        onOpenChange={setShowPermanentDeleteDialog}
      />
    </>
  );
}
