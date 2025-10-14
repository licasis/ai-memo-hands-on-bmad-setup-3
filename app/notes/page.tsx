// app/notes/page.tsx
// 노트 목록 페이지
// 사용자의 모든 노트를 표시하고 페이지네이션을 통해 탐색할 수 있는 페이지
// 관련 파일: lib/db/queries/notes.ts, components/notes/note-list.tsx, components/notes/note-pagination.tsx

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getNotesByUserId, getNotesCountByUserId } from '@/lib/db/queries/notes';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { NoteList } from '@/components/notes/note-list';
import { NotePagination } from '@/components/notes/note-pagination';
import { NoteSort } from '@/components/notes/note-sort';
import { EmptyStateEnhanced } from '@/components/notes/empty-state-enhanced';

interface NotesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
  }>;
}

async function NotesListWithPagination({ searchParams }: NotesPageProps) {
  // 실제 사용자 인증
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }
  
  const userId = user!.id;
  
  // searchParams를 await로 처리
  const resolvedSearchParams = await searchParams;
  
  // URL 파라미터에서 페이지네이션 설정 추출
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const limit = parseInt(resolvedSearchParams.limit || '10', 10);
  const sortParam = resolvedSearchParams.sort || 'updatedAt-desc';
  
  // 정렬 파라미터 파싱
  const [orderBy, orderDirection] = sortParam.split('-') as [string, string];
  
  // 페이지네이션 계산
  const offset = (page - 1) * limit;
  
  try {
    // 노트 목록과 총 개수를 개별적으로 조회 (에러 핸들링을 위해)
    let notes: any[] = [], totalCount: number = 0;
    
    try {
      notes = await getNotesByUserId(userId, {
        limit,
        offset,
        orderBy: orderBy as 'createdAt' | 'updatedAt' | 'title',
        orderDirection: orderDirection as 'asc' | 'desc',
      });
    } catch (error) {
      console.error('노트 조회 오류:', error);
      notes = []; // 빈 배열로 초기화
    }
    
    try {
      totalCount = await getNotesCountByUserId(userId);
    } catch (error) {
      console.error('노트 개수 조회 오류:', error);
      totalCount = notes.length; // 조회된 노트 개수 사용
    }

    const totalPages = Math.ceil(totalCount / limit);

    // 노트가 없는 경우 빈 상태 표시
    if (totalCount === 0) {
      return <EmptyStateEnhanced />;
    }

    return (
      <>
        <NoteList notes={notes} />
        <NotePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={limit}
        />
      </>
    );
  } catch (error) {
    console.error('노트 로딩 오류:', error);
    return (
      <NoteList 
        notes={[]} 
        error="데이터베이스 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요." 
      />
    );
  }
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  // searchParams를 await로 처리
  const resolvedSearchParams = await searchParams;
  
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
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              작성한 노트들을 확인하고 관리하세요.
            </p>
            <NoteSort currentSort={resolvedSearchParams.sort as any} />
          </div>
        </div>

        <Suspense fallback={<NoteList notes={[]} isLoading={true} />}>
          <NotesListWithPagination searchParams={searchParams} />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}
