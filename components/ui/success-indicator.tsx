// components/ui/success-indicator.tsx
// 완료 상태 표시 컴포넌트
// AI 처리 완료 시 성공 상태를 표시하는 컴포넌트
// 관련 파일: components/ui/ai-status-indicator.tsx, components/notes/ai-summary-button.tsx

'use client';

import { CheckCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
  showMessage?: boolean;
  variant?: 'default' | 'minimal';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function SuccessIndicator({ 
  size = 'md', 
  className,
  message = '완료되었습니다',
  showMessage = false,
  variant = 'default'
}: SuccessIndicatorProps) {
  const Icon = variant === 'minimal' ? Check : CheckCircle;
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon 
        className={cn(
          'text-green-500 animate-in fade-in-0 zoom-in-95 duration-300',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {showMessage && (
        <span className="text-sm text-green-600 animate-in fade-in-0 slide-in-from-left-2 duration-300">
          {message}
        </span>
      )}
    </div>
  );
}

export function SuccessCheckmark({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div className="w-6 h-6 border-2 border-green-500 rounded-full animate-in zoom-in-95 duration-300">
        <Check 
          className="w-4 h-4 text-green-500 absolute top-0.5 left-0.5 animate-in fade-in-0 slide-in-from-left-1 duration-200 [animation-delay:150ms]"
          strokeWidth={3}
        />
      </div>
    </div>
  );
}

export function SuccessBadge({ 
  message, 
  className 
}: { 
  message: string; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium animate-in fade-in-0 slide-in-from-top-2 duration-300',
      className
    )}>
      <CheckCircle className="w-4 h-4" />
      {message}
    </div>
  );
}
