// app/notes/recent/page.tsx
// 최근 조회한 노트 페이지
// lastViewedAt을 기준으로 1일전, 1주일전, 1달전으로 그룹화하여 노트 목록을 표시
// 관련 파일: lib/db/queries/notes.ts, components/notes/recent-notes-list.tsx

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getRecentNotesByUserId } from '@/lib/db/queries/notes';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { RecentNotesList } from '@/components/notes/recent-notes-list';
import { LoadingSkeleton } from '@/components/notes/loading-skeleton';

async function RecentNotesContent() {
  // 실제 사용자 인증
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }
  
  const userId = user.id;
  
  try {
    const recentNotes = await getRecentNotesByUserId(userId);
    
    return <RecentNotesList recentNotes={recentNotes} />;
  } catch (error) {
    console.error('최근 노트 로딩 오류:', error);
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">최근 노트를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }
}

export default function RecentNotesPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">최근 조회한 노트</h1>
          <p className="text-gray-600">마지막으로 조회한 시간을 기준으로 노트를 그룹화했습니다.</p>
        </div>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <RecentNotesContent />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}
