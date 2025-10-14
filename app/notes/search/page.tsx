// app/notes/search/page.tsx
// 노트 검색 페이지
// 사용자가 노트를 검색하고 필터링할 수 있는 페이지
// 관련 파일: components/notes/search-form.tsx, lib/db/queries/notes.ts

import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { NoteList } from '@/components/notes/note-list';
import { NotePagination } from '@/components/notes/note-pagination';
import { NoteSort } from '@/components/notes/note-sort';
import { EmptyStateEnhanced } from '@/components/notes/empty-state-enhanced';
import { searchNotesByUserId, getSearchNotesCountByUserId } from '@/lib/db/queries/notes';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    limit?: string;
    sort?: string;
  }>;
}

async function SearchResults({ searchParams }: SearchPageProps) {
  // 실제 사용자 인증
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/login');
  }
  
  const userId = user.id;
  
  // searchParams를 await로 처리
  const resolvedSearchParams = await searchParams;
  
  const searchQuery = resolvedSearchParams.q || '';
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const limit = parseInt(resolvedSearchParams.limit || '10', 10);
  const sortParam = resolvedSearchParams.sort || 'updatedAt-desc';
  
  // 정렬 파라미터 파싱
  const [orderBy, orderDirection] = sortParam.split('-') as [string, string];
  
  // 페이지네이션 계산
  const offset = (page - 1) * limit;
  
  // 검색어가 없으면 빈 상태 표시
  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">검색어를 입력하세요</h3>
        <p className="text-gray-600">
          위의 검색창에 원하는 키워드를 입력하여 노트를 찾아보세요.
        </p>
      </div>
    );
  }
  
  try {
    // 검색 결과와 총 개수를 개별적으로 조회
    let notes, totalCount;
    
    try {
      notes = await searchNotesByUserId(userId, searchQuery, {
        limit,
        offset,
        orderBy: orderBy as 'createdAt' | 'updatedAt' | 'title',
        orderDirection: orderDirection as 'asc' | 'desc',
      });
    } catch (error) {
      console.error('검색 오류:', error);
      notes = [];
    }
    
    try {
      totalCount = await getSearchNotesCountByUserId(userId, searchQuery);
    } catch (error) {
      console.error('검색 개수 오류:', error);
      totalCount = notes.length;
    }

    const totalPages = Math.ceil(totalCount / limit);

    // 검색 결과가 없는 경우
    if (totalCount === 0) {
      return (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600">
            "{searchQuery}"에 대한 검색 결과를 찾을 수 없습니다. 다른 키워드로 시도해보세요.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4">
          <p className="text-gray-600">
            "{searchQuery}"에 대한 검색 결과 {totalCount}개를 찾았습니다.
          </p>
        </div>
        <NoteList notes={notes} />
        <NotePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={limit}
          baseUrl={`/notes/search?q=${encodeURIComponent(searchQuery)}`}
        />
      </>
    );
  } catch (error) {
    console.error('검색 로딩 오류:', error);
    return (
      <NoteList 
        notes={[]} 
        error="검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." 
      />
    );
  }
}

export default async function NotesSearchPage({ searchParams }: SearchPageProps) {
  // searchParams를 await로 처리
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.q || '';
  
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">노트 검색</h1>
          <p className="text-gray-600">
            원하는 내용을 검색하고 필터링하세요.
          </p>
        </div>

        {/* 검색 폼 */}
        <Card className="p-6 mb-6">
          <form action="/notes/search" method="GET" className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  name="q"
                  placeholder="노트 제목이나 내용을 검색하세요..."
                  className="pl-10"
                  defaultValue={searchQuery}
                />
              </div>
            </div>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
            <Button variant="outline" type="button">
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
          </form>
        </Card>

        {/* 정렬 옵션 */}
        {searchQuery && (
          <div className="mb-4 flex justify-end">
            <NoteSort currentSort={resolvedSearchParams.sort as any} />
          </div>
        )}

        {/* 검색 결과 */}
        <Suspense fallback={<NoteList notes={[]} isLoading={true} />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}
