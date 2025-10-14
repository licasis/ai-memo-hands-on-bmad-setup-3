// app/trash/page.tsx
// 휴지통 페이지
// 삭제된 노트들을 표시하고 복구/영구삭제 기능을 제공하는 페이지
// 관련 파일: lib/db/queries/notes.ts, components/trash/trash-list.tsx, components/trash/trash-pagination.tsx

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getDeletedNotesByUserId, getDeletedNotesCountByUserId } from '@/lib/db/queries/notes';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { TrashList } from '@/components/trash/trash-list';
import { TrashPagination } from '@/components/trash/trash-pagination';

interface TrashPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    sort?: string;
    order?: string;
  };
}

async function TrashListWithPagination({ searchParams }: TrashPageProps) {
  // 실제 사용자 인증
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }
  
  const userId = user.id;

  // URL 파라미터에서 페이지네이션 설정 추출
  const page = parseInt(searchParams.page || '1', 10);
  const limit = parseInt(searchParams.limit || '10', 10);
  const sort = searchParams.sort || 'deletedAt';
  const order = searchParams.order || 'desc';

  // 페이지네이션 계산
  const offset = (page - 1) * limit;

  try {
    // 삭제된 노트 목록과 총 개수를 병렬로 조회
    const [deletedNotes, totalCount] = await Promise.all([
      getDeletedNotesByUserId(userId, {
        limit,
        offset,
        orderBy: sort as 'createdAt' | 'updatedAt' | 'deletedAt',
        orderDirection: order as 'asc' | 'desc',
      }),
      getDeletedNotesCountByUserId(userId),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return (
      <>
        <TrashList notes={deletedNotes} />
        <TrashPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={limit}
        />
      </>
    );
  } catch (error) {
    console.error('휴지통 노트 로딩 오류:', error);
    return (
      <TrashList
        notes={[]}
        error="데이터베이스 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요."
      />
    );
  }
}

export default function TrashPage({ searchParams }: TrashPageProps) {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">휴지통</h1>
            <div className="flex gap-2">
              <Link href="/notes">
                <Button variant="outline">노트 목록</Button>
              </Link>
            </div>
          </div>
          <p className="text-gray-600">
            삭제된 노트들을 확인하고 복구하거나 영구 삭제할 수 있습니다.
          </p>
        </div>

        <Suspense fallback={<TrashList notes={[]} isLoading={true} />}>
          <TrashListWithPagination searchParams={searchParams} />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}
