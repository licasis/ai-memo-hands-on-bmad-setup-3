// components/notes/delete-confirm-dialog.tsx
// 노트 삭제 확인 다이얼로그 컴포넌트
// 노트 삭제 전 확인을 받는 다이얼로그
// 관련 파일: components/notes/note-detail.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>노트 삭제</DialogTitle>
              <DialogDescription className="mt-1">
                이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            <strong>"{noteTitle}"</strong> 노트를 삭제하시겠습니까?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            삭제된 노트는 복구할 수 없습니다.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
