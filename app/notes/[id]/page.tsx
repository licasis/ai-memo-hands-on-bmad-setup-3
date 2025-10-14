// app/notes/[id]/page.tsx
// 노트 상세 조회 페이지
// 특정 노트의 전체 내용을 표시하고 수정/삭제 액션을 제공하는 페이지
// 관련 파일: lib/db/queries/notes.ts, components/notes/note-detail.tsx

import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getNoteById } from '@/lib/db/queries/notes';
import { createClient } from '@/lib/supabase/server';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { NoteDetail } from '@/components/notes/note-detail';
import { LoadingSkeleton } from '@/components/notes/loading-skeleton';

interface NoteDetailPageProps {
  params: {
    id: string;
  };
}

async function NoteDetailContent({ noteId }: { noteId: string }) {
  // 실제 사용자 인증
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }
  
  const userId = user.id;
  
  try {
    const note = await getNoteById(noteId, userId);
    
    if (!note) {
      notFound();
    }

    return <NoteDetail note={note} />;
  } catch (error) {
    console.error('노트 로딩 오류:', error);
    notFound();
  }
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { id: noteId } = params;

  // UUID 형식 검증
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(noteId)) {
    notFound();
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<LoadingSkeleton />}>
          <NoteDetailContent noteId={noteId} />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}
