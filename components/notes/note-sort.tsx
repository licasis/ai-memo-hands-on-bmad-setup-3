// components/notes/note-sort.tsx
// 노트 정렬 옵션 컴포넌트
// 사용자가 노트 목록을 다양한 기준으로 정렬할 수 있는 드롭다운 컴포넌트
// 관련 파일: app/notes/page.tsx, lib/db/queries/notes.ts

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Calendar, FileText } from 'lucide-react';

export type SortOption = 'updatedAt-desc' | 'updatedAt-asc' | 'createdAt-desc' | 'createdAt-asc' | 'title-asc' | 'title-desc';

export interface NoteSortProps {
  currentSort?: SortOption;
  className?: string;
}

const sortOptions = [
  {
    value: 'updatedAt-desc' as const,
    label: '최신순',
    icon: Calendar,
  },
  {
    value: 'updatedAt-asc' as const,
    label: '오래된순',
    icon: Calendar,
  },
  {
    value: 'createdAt-desc' as const,
    label: '작성일 최신순',
    icon: Calendar,
  },
  {
    value: 'createdAt-asc' as const,
    label: '작성일 오래된순',
    icon: Calendar,
  },
  {
    value: 'title-asc' as const,
    label: '제목 A-Z',
    icon: FileText,
  },
  {
    value: 'title-desc' as const,
    label: '제목 Z-A',
    icon: FileText,
  },
];

export function NoteSort({ currentSort = 'updatedAt-desc', className }: NoteSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1'); // Reset to first page when sort changes
    router.push(`${pathname}?${params.toString()}`);
  };

  // Validate currentSort and fallback to default if invalid
  const validSort = sortOptions.find(option => option.value === currentSort) ? currentSort : 'updatedAt-desc';
  const currentOption = sortOptions.find(option => option.value === validSort);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600 whitespace-nowrap">정렬:</span>
      <Select value={validSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-40">
          <SelectValue>
            {currentOption && (
              <div className="flex items-center gap-2">
                <currentOption.icon className="w-4 h-4" />
                <span>{currentOption.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
