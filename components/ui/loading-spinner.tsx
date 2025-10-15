// components/ui/loading-spinner.tsx
// 로딩 스피너 컴포넌트
// AI 처리 중 로딩 상태를 표시하는 스피너 컴포넌트
// 관련 파일: components/ui/ai-status-indicator.tsx, components/notes/ai-summary-button.tsx

'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
  showMessage?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function LoadingSpinner({ 
  size = 'md', 
  className,
  message = '로딩 중...',
  showMessage = false
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 
        className={cn(
          'animate-spin text-blue-500',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {showMessage && (
        <span className="text-sm text-gray-600 animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  );
}

export function LoadingPulse({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );
}
