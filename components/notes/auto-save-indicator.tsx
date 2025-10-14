// components/notes/auto-save-indicator.tsx
// 자동 저장 상태 표시 컴포넌트
// 실시간 저장 상태와 마지막 저장 시간을 표시하는 컴포넌트
// 관련 파일: components/notes/note-editor.tsx

'use client';

import { Check, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  hasUnsavedChanges,
  error,
}: AutoSaveIndicatorProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return '방금 전';
    } else if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>저장 실패</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-blue-600 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>저장 중...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center gap-2 text-orange-600 text-sm">
        <Clock className="w-4 h-4" />
        <span>저장 대기 중</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <Check className="w-4 h-4" />
        <span>{formatLastSaved(lastSaved)}에 저장됨</span>
      </div>
    );
  }

  return null;
}
