// lib/hooks/use-auto-save.ts
// 자동 저장 훅
// 실시간 저장 기능을 제공하는 커스텀 훅
// 관련 파일: components/notes/note-editor.tsx

import { useEffect, useState, useCallback } from 'react';

interface UseAutoSaveOptions {
  saveFunction: (data: any) => Promise<{ success: boolean; error?: string }>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>(
  data: T,
  options: UseAutoSaveOptions
) {
  const { saveFunction, delay = 2000, enabled = true } = options;
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (dataToSave: T) => {
    if (isSaving || !enabled) return;

    setIsSaving(true);
    setError(null);

    try {
      const result = await saveFunction(dataToSave);
      
      if (result.success) {
        setLastSaved(new Date());
      } else {
        setError(result.error || '저장 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('자동 저장 오류:', err);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [saveFunction, isSaving, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      save(data);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [data, save, delay, enabled]);

  return {
    isSaving,
    lastSaved,
    error,
    save: () => save(data),
  };
}
