// components/trash/restore-confirm-dialog.tsx
// 노트 복구 확인 다이얼로그 컴포넌트
// 휴지통에서 노트를 복구할 때 확인하는 다이얼로그
// 관련 파일: app/trash/actions.ts, components/trash/trash-note-card.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { restoreNoteAction } from '@/app/trash/actions';

interface RestoreConfirmDialogProps {
  note: {
    id: string;
    title: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RestoreConfirmDialog({ note, open, onOpenChange }: RestoreConfirmDialogProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  const handleRestore = async () => {
    setIsRestoring(true);
    
    try {
      const result = await restoreNoteAction(note.id);
      
      if (result.success) {
        onOpenChange(false);
        router.refresh(); // 페이지 새로고침으로 목록 업데이트
      } else {
        console.error('복구 실패:', result.error);
        // TODO: 토스트 메시지 표시
      }
    } catch (error) {
      console.error('복구 오류:', error);
      // TODO: 토스트 메시지 표시
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>노트 복구</DialogTitle>
          <DialogDescription>
            <strong>"{note.title}"</strong> 노트를 복구하시겠습니까?
            <br />
            복구된 노트는 노트 목록에서 다시 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRestoring}
          >
            취소
          </Button>
          <Button
            onClick={handleRestore}
            disabled={isRestoring}
            className="bg-green-600 hover:bg-green-700"
          >
            {isRestoring ? '복구 중...' : '복구'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
