// components/ui/error-indicator.tsx
// 에러 상태 표시 컴포넌트
// AI 처리 실패 시 에러 상태를 표시하는 컴포넌트
// 관련 파일: components/ui/ai-status-indicator.tsx, components/notes/ai-summary-button.tsx

'use client';

import { AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
  showMessage?: boolean;
  variant?: 'default' | 'minimal' | 'warning';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function ErrorIndicator({ 
  size = 'md', 
  className,
  message = '오류가 발생했습니다',
  showMessage = false,
  variant = 'default'
}: ErrorIndicatorProps) {
  const Icon = variant === 'warning' ? AlertTriangle : variant === 'minimal' ? XCircle : AlertCircle;
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon 
        className={cn(
          'text-red-500 animate-in fade-in-0 zoom-in-95 duration-300',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {showMessage && (
        <span className="text-sm text-red-600 animate-in fade-in-0 slide-in-from-left-2 duration-300">
          {message}
        </span>
      )}
    </div>
  );
}

export function ErrorBadge({ 
  message, 
  className,
  variant = 'default'
}: { 
  message: string; 
  className?: string;
  variant?: 'default' | 'warning';
}) {
  const Icon = variant === 'warning' ? AlertTriangle : AlertCircle;
  const bgColor = variant === 'warning' ? 'bg-yellow-50' : 'bg-red-50';
  const textColor = variant === 'warning' ? 'text-yellow-700' : 'text-red-700';
  
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in-0 slide-in-from-top-2 duration-300',
      bgColor,
      textColor,
      className
    )}>
      <Icon className="w-4 h-4" />
      {message}
    </div>
  );
}

export function ErrorAlert({ 
  title,
  message,
  className,
  onRetry
}: { 
  title?: string;
  message: string; 
  className?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={cn(
      'flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300',
      className
    )}>
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-medium text-red-800 mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-red-700">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
