// components/notes/onboarding-tooltip.tsx
// 온보딩 툴팁 컴포넌트
// 첫 사용자에게 기능을 안내하는 툴팁 컴포넌트
// 관련 파일: components/notes/empty-state-enhanced.tsx

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface OnboardingTooltipProps {
  children: ReactNode;
  content: string;
  isVisible: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function OnboardingTooltip({ 
  children, 
  content, 
  isVisible, 
  placement = 'top',
  className 
}: OnboardingTooltipProps) {
  if (!isVisible) {
    return <>{children}</>;
  }

  const placementClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      <div className={cn(
        'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap',
        placementClasses[placement]
      )}>
        {content}
        <div className={cn(
          'absolute w-0 h-0 border-4',
          arrowClasses[placement]
        )} />
      </div>
    </div>
  );
}
