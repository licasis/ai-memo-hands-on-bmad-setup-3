// app/notes/[id]/edit/not-found.tsx
// 편집할 수 없는 노트에 접근했을 때 표시되는 404 페이지

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Edit3, FileX } from 'lucide-react';

export default function EditNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <Edit3 className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">노트를 편집할 수 없습니다</h1>
            <p className="text-gray-600">요청하신 노트가 존재하지 않거나 편집 권한이 없습니다.</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/notes">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  노트 목록으로 돌아가기
                </Button>
              </Link>
              <Link href="/notes/create">
                <Button className="inline-flex items-center gap-2">
                  새 노트 작성
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
