// components/notes/empty-state-enhanced.tsx
// 향상된 빈 상태 UI 컴포넌트
// 노트가 없을 때 친근한 메시지와 온보딩을 제공하는 컴포넌트
// 관련 파일: app/notes/page.tsx, components/notes/onboarding-tooltip.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText, Plus, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { OnboardingTooltip } from './onboarding-tooltip';

export interface EmptyStateEnhancedProps {
  className?: string;
  showOnboarding?: boolean;
  onOnboardingComplete?: () => void;
}

export function EmptyStateEnhanced({ 
  className = '', 
  showOnboarding = false,
  onOnboardingComplete 
}: EmptyStateEnhancedProps) {
  const [onboardingStep, setOnboardingStep] = useState(0);

  return (
    <div className={`flex items-center justify-center py-12 px-4 ${className}`}>
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            아직 노트가 없어요
          </h2>
          <p className="text-gray-600 leading-relaxed">
            첫 번째 노트를 작성해서 시작해보세요!<br />
            생각을 정리하고 중요한 내용을 기록할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <OnboardingTooltip
                content="첫 번째 노트를 작성해보세요!"
                isVisible={showOnboarding && onboardingStep === 0}
                placement="top"
              >
                <Link href="/notes/create">
                  <Button className="w-full sm:w-auto inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    새 노트 작성
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </OnboardingTooltip>
            </div>
            
            {showOnboarding && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>온보딩 중...</span>
              </div>
            )}
            
            <div className="text-xs text-gray-400 space-y-1">
              <p>💡 <strong>팁:</strong> 노트는 자동으로 저장됩니다</p>
              <p>📱 모바일에서도 편리하게 사용하세요</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
