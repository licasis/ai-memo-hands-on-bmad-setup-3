// components/trash/trash-pagination.tsx
// 휴지통 페이지네이션 컴포넌트
// 휴지통 노트 목록의 페이지네이션을 처리하는 컴포넌트
// 관련 파일: app/trash/page.tsx

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TrashPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function TrashPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: TrashPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateLimit = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', limit.toString());
    params.set('page', '1'); // Reset to first page when limit changes
    router.push(`${pathname}?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          총 {totalItems}개 중 {startItem}-{endItem}개 표시
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(1)}
            disabled={currentPage === 1}
            aria-label="첫 페이지로 이동"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지로 이동"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => typeof page === 'number' && updatePage(page)}
              disabled={typeof page !== 'number'}
            >
              {page}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지로 이동"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="마지막 페이지로 이동"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">페이지당:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => updateLimit(parseInt(value, 10))}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
