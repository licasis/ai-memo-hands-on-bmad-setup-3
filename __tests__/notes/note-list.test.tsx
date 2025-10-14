// __tests__/notes/note-list.test.tsx
// 노트 목록 컴포넌트 테스트
// NoteList 컴포넌트의 렌더링, 로딩 상태, 에러 상태를 테스트
// 관련 파일: components/notes/note-list.tsx, components/notes/note-card.tsx

import { render, screen } from '@testing-library/react';
import { NoteList } from '@/components/notes/note-list';
import { Note } from '@/lib/db/types';

// Mock data
const mockNotes: Note[] = [
  {
    id: '1',
    userId: 'user-1',
    title: '첫 번째 노트',
    content: '이것은 첫 번째 노트의 내용입니다.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    userId: 'user-1',
    title: '두 번째 노트',
    content: '이것은 두 번째 노트의 내용입니다.',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

describe('NoteList', () => {
  it('노트 목록을 올바르게 렌더링한다', () => {
    render(<NoteList notes={mockNotes} />);
    
    expect(screen.getByText('첫 번째 노트')).toBeInTheDocument();
    expect(screen.getByText('두 번째 노트')).toBeInTheDocument();
    expect(screen.getByText('이것은 첫 번째 노트의 내용입니다.')).toBeInTheDocument();
  });

  it('빈 노트 목록일 때 EmptyState를 표시한다', () => {
    render(<NoteList notes={[]} />);
    
    expect(screen.getByText('아직 노트가 없습니다')).toBeInTheDocument();
    expect(screen.getByText('새 노트 작성')).toBeInTheDocument();
  });

  it('로딩 중일 때 LoadingSkeleton을 표시한다', () => {
    render(<NoteList notes={[]} isLoading={true} />);
    
    // 스켈레톤 카드들이 렌더링되는지 확인
    const skeletonCards = document.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('에러가 있을 때 에러 메시지를 표시한다', () => {
    const errorMessage = '데이터베이스 연결 오류';
    render(<NoteList notes={[]} error={errorMessage} />);
    
    expect(screen.getByText('노트를 불러올 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('각 노트에 보기 버튼이 있다', () => {
    render(<NoteList notes={mockNotes} />);
    
    const viewButtons = screen.getAllByText('보기');
    expect(viewButtons).toHaveLength(2);
  });

  it('노트 제목이 올바르게 표시된다', () => {
    render(<NoteList notes={mockNotes} />);
    
    expect(screen.getByRole('heading', { name: '첫 번째 노트' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '두 번째 노트' })).toBeInTheDocument();
  });
});
