// app/notes/[id]/edit/page.tsx
// 노트 편집 페이지
// 기존 노트를 수정할 수 있는 페이지로, 실시간 저장 기능을 제공
// 관련 파일: lib/db/queries/notes.ts, components/notes/note-editor.tsx, app/notes/[id]/edit/actions.ts

import { notFound } from 'next/navigation';
import { getNoteById } from '@/lib/db/queries/notes';
import { createClient } from '@/lib/supabase/server';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { NoteEditor } from '@/components/notes/note-editor';

interface NoteEditPageProps {
  params: {
    id: string;
  };
}

export default async function NoteEditPage({ params }: NoteEditPageProps) {
  const { id } = params;

  // 임시로 인증을 우회하여 메모 기능 테스트
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  // 실제 Supabase 인증 사용 시
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   // 로그인 페이지로 리다이렉트 또는 에러 처리
  //   notFound();
  // }
  // const userId = user.id;

  const note = await getNoteById(id, mockUserId); // 실제 userId 사용

  if (!note) {
    notFound();
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto py-8">
        <NoteEditor note={note} />
      </div>
    </AuthenticatedLayout>
  );
}
