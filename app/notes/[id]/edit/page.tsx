// app/notes/[id]/edit/page.tsx
// 노트 편집 페이지
// 기존 노트를 수정할 수 있는 페이지로, 실시간 저장 기능을 제공
// 관련 파일: lib/db/queries/notes.ts, components/notes/note-editor.tsx, app/notes/[id]/edit/actions.ts

import { notFound, redirect } from 'next/navigation';
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

  // 실제 사용자 인증
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }
  
  const userId = user.id;

  const note = await getNoteById(id, userId);

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
