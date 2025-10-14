// components/trash/permanent-delete-dialog.tsx
// 노트 영구 삭제 확인 다이얼로그 컴포넌트
// 휴지통에서 노트를 영구 삭제할 때 확인하는 다이얼로그
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
import { permanentDeleteNoteAction } from '@/app/trash/actions';
import { AlertTriangle } from 'lucide-react';

interface PermanentDeleteDialogProps {
  note: {
    id: string;
    title: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PermanentDeleteDialog({ note, open, onOpenChange }: PermanentDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const router = useRouter();

  const isConfirmValid = confirmText === '영구삭제';

  const handlePermanentDelete = async () => {
    if (!isConfirmValid) return;

    setIsDeleting(true);
    
    try {
      const result = await permanentDeleteNoteAction(note.id);
      
      if (result.success) {
        onOpenChange(false);
        setConfirmText('');
        router.refresh(); // 페이지 새로고침으로 목록 업데이트
      } else {
        console.error('영구 삭제 실패:', result.error);
        // TODO: 토스트 메시지 표시
      }
    } catch (error) {
      console.error('영구 삭제 오류:', error);
      // TODO: 토스트 메시지 표시
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setConfirmText('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            노트 영구 삭제
          </DialogTitle>
          <DialogDescription>
            <strong>"{note.title}"</strong> 노트를 영구적으로 삭제하시겠습니까?
            <br />
            <br />
            <strong className="text-red-600">이 작업은 되돌릴 수 없습니다.</strong>
            <br />
            노트와 관련된 모든 데이터가 완전히 삭제됩니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label htmlFor="confirm-text" className="block text-sm font-medium text-gray-700 mb-2">
            확인을 위해 <strong>"영구삭제"</strong>를 입력하세요:
          </label>
          <input
            id="confirm-text"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="영구삭제"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            취소
          </Button>
          <Button
            onClick={handlePermanentDelete}
            disabled={isDeleting || !isConfirmValid}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? '삭제 중...' : '영구 삭제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
