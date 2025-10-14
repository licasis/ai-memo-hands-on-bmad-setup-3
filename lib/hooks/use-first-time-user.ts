// lib/hooks/use-first-time-user.ts
// 첫 사용자 감지 훅
// 사용자가 처음 앱을 사용하는지 확인하는 훅
// 관련 파일: components/notes/empty-state-enhanced.tsx

'use client';

import { useState, useEffect } from 'react';

const FIRST_TIME_USER_KEY = 'ai-memo-first-time-user';

export function useFirstTimeUser() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    const hasVisitedBefore = localStorage.getItem(FIRST_TIME_USER_KEY);
    setIsFirstTime(!hasVisitedBefore);
    setIsLoading(false);
  }, []);

  const markAsVisited = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(FIRST_TIME_USER_KEY, 'true');
    setIsFirstTime(false);
  };

  const resetFirstTime = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(FIRST_TIME_USER_KEY);
    setIsFirstTime(true);
  };

  return {
    isFirstTime,
    isLoading,
    markAsVisited,
    resetFirstTime,
  };
}
