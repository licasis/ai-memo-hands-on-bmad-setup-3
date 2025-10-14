// components/trash/trash-loading-skeleton.tsx
// 휴지통 로딩 스켈레톤 컴포넌트
// 휴지통 노트를 로딩하는 동안 표시되는 스켈레톤 UI
// 관련 파일: app/trash/page.tsx

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function TrashLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-red-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-40"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
