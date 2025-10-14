// components/notes/loading-skeleton.tsx
// 로딩 스켈레톤 UI 컴포넌트
// 노트 목록 로딩 중에 표시되는 스켈레톤 UI
// 관련 파일: components/notes/note-list.tsx, app/notes/page.tsx

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
