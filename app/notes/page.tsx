// app/notes/page.tsx
// 노트 목록 페이지
// 사용자의 모든 노트를 표시하고 새 노트 생성으로 이동할 수 있는 페이지
// 관련 파일: lib/db/queries/notes.ts, app/notes/create/page.tsx

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { getNotesByUserId } from '@/lib/db/queries/notes';
import { createClient } from '@/lib/supabase/server';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';

async function NotesList() {
  // 임시로 인증을 우회하여 메모 기능 테스트
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  
  try {
    const notes = await getNotesByUserId(mockUserId, { limit: 20 });

    if (notes.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 노트가 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 번째 노트를 작성해보세요!</p>
          <Link href="/notes/create">
            <Button>새 노트 작성</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                  {note.content}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(note.updatedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="ml-4">
                <Link href={`/notes/${note.id}`}>
                  <Button variant="outline" size="sm">
                    보기
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    console.error('노트 로딩 오류:', error);
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">노트를 불러올 수 없습니다</h3>
        <p className="text-gray-600 mb-6">데이터베이스 연결에 문제가 있습니다.</p>
        <Link href="/notes/create">
          <Button>새 노트 작성</Button>
        </Link>
      </div>
    );
  }
}

export default function NotesPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">내 노트</h1>
            <Link href="/notes/create">
              <Button>새 노트 작성</Button>
            </Link>
          </div>
          <p className="text-gray-600">
            작성한 노트들을 확인하고 관리하세요.
          </p>
        </div>

        <Suspense fallback={<div>노트를 불러오는 중...</div>}>
          <NotesList />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}
