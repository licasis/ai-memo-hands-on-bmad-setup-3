// components/notes/recent-notes-list.tsx
// 최근 조회한 노트 목록 컴포넌트
// 시간대별로 그룹화된 노트 목록을 표시하고 클릭 시 상세 페이지로 이동
// 관련 파일: app/notes/recent/page.tsx, lib/db/queries/notes.ts

'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ChevronRight } from 'lucide-react';
import { Note } from '@/lib/db/types';

interface GroupedNotes {
  today: Note[];
  thisWeek: Note[];
  thisMonth: Note[];
  older: Note[];
}

interface RecentNotesListProps {
  recentNotes: GroupedNotes;
}

export function RecentNotesList({ recentNotes }: RecentNotesListProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}일 전`;
    }
  };

  const NoteGroup = ({ 
    title, 
    notes, 
    icon, 
    badgeColor 
  }: { 
    title: string; 
    notes: Note[]; 
    icon: React.ReactNode; 
    badgeColor: string;
  }) => {
    if (notes.length === 0) {
      return null;
    }

    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
            <Badge variant="secondary" className={badgeColor}>
              {notes.length}개
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(note.lastViewedAt!)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(note.lastViewedAt!)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalNotes = recentNotes.today.length + recentNotes.thisWeek.length + 
                    recentNotes.thisMonth.length + recentNotes.older.length;

  if (totalNotes === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">최근 조회한 노트가 없습니다</h3>
        <p className="text-gray-500 mb-4">
          노트를 클릭하여 상세 페이지를 보면 여기에 표시됩니다.
        </p>
        <Link
          href="/notes"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          모든 노트 보기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NoteGroup
        title="오늘"
        notes={recentNotes.today}
        icon={<Clock className="w-5 h-5 text-green-600" />}
        badgeColor="bg-green-100 text-green-800"
      />
      
      <NoteGroup
        title="이번 주"
        notes={recentNotes.thisWeek}
        icon={<Clock className="w-5 h-5 text-blue-600" />}
        badgeColor="bg-blue-100 text-blue-800"
      />
      
      <NoteGroup
        title="이번 달"
        notes={recentNotes.thisMonth}
        icon={<Clock className="w-5 h-5 text-orange-600" />}
        badgeColor="bg-orange-100 text-orange-800"
      />
      
      <NoteGroup
        title="그 이전"
        notes={recentNotes.older}
        icon={<Clock className="w-5 h-5 text-gray-600" />}
        badgeColor="bg-gray-100 text-gray-800"
      />
    </div>
  );
}
