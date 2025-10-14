// app/notes/create/page.tsx
// 노트 생성 페이지
// 사용자가 새로운 노트를 생성할 수 있는 페이지
// 관련 파일: components/notes/create-note-form.tsx, app/notes/create/actions.ts

import { Suspense } from 'react';
import CreateNoteForm from '@/components/notes/create-note-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';

export default function CreateNotePage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">새 노트 작성</h1>
            <Link href="/notes">
              <Button variant="outline">
                노트 목록으로
              </Button>
            </Link>
          </div>
          <p className="text-gray-600">
            아이디어나 정보를 빠르게 기록하고 저장하세요.
          </p>
        </div>

        <Suspense fallback={<div>로딩 중...</div>}>
          <CreateNoteForm />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}
