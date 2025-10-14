// components/trash/trash-empty-state.tsx
// 휴지통 빈 상태 컴포넌트
// 삭제된 노트가 없을 때 표시되는 컴포넌트
// 관련 파일: app/trash/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2, ArrowLeft } from 'lucide-react';

export function TrashEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader className="pb-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">휴지통이 비어있습니다</h3>
            <p className="text-gray-600">
              삭제된 노트가 없습니다. 노트를 삭제하면 여기에 표시됩니다.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/notes">
              <Button className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                노트 목록으로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
