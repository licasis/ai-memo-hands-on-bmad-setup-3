// lib/hooks/use-debounce.ts
// 디바운스 훅
// 함수 호출을 지연시켜 성능을 최적화하는 커스텀 훅
// 관련 파일: components/notes/note-editor.tsx

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
