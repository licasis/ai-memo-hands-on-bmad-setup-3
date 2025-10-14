// __tests__/trash/trash-list.test.tsx
// 휴지통 노트 목록 컴포넌트 테스트
// 휴지통 노트 목록 렌더링과 상태 처리를 테스트

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrashList } from '@/components/trash/trash-list';

// Mock database connection
jest.mock('@/lib/db/index', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
  },
}));

// Mock server actions
jest.mock('@/app/trash/actions', () => ({
  restoreNoteAction: jest.fn(),
  permanentDeleteNoteAction: jest.fn(),
}));

const mockNotes = [
  {
    id: '1',
    title: '삭제된 노트 1',
    content: '이것은 삭제된 노트의 내용입니다.',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    deletedAt: new Date('2024-01-02T15:30:00Z'),
  },
  {
    id: '2',
    title: '삭제된 노트 2',
    content: '또 다른 삭제된 노트의 내용입니다.',
    createdAt: new Date('2024-01-02T10:00:00Z'),
    updatedAt: new Date('2024-01-02T10:00:00Z'),
    deletedAt: new Date('2024-01-03T15:30:00Z'),
  },
];

describe('TrashList', () => {
  it('삭제된 노트 목록을 올바르게 렌더링한다', () => {
    render(<TrashList notes={mockNotes} />);

    expect(screen.getByText('삭제된 노트 1')).toBeInTheDocument();
    expect(screen.getByText('삭제된 노트 2')).toBeInTheDocument();
    expect(screen.getByText('이것은 삭제된 노트의 내용입니다.')).toBeInTheDocument();
  });

  it('로딩 상태를 올바르게 표시한다', () => {
    render(<TrashList notes={[]} isLoading={true} />);

    // 스켈레톤 카드들이 있는지 확인
    const cards = document.querySelectorAll('.animate-pulse');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('에러 상태를 올바르게 표시한다', () => {
    const errorMessage = '데이터베이스 연결 오류';
    render(<TrashList notes={[]} error={errorMessage} />);

    expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('빈 상태를 올바르게 표시한다', () => {
    render(<TrashList notes={[]} />);

    expect(screen.getByText('휴지통이 비어있습니다')).toBeInTheDocument();
    expect(screen.getByText('삭제된 노트가 없습니다. 노트를 삭제하면 여기에 표시됩니다.')).toBeInTheDocument();
  });

  it('복구 및 영구삭제 버튼이 있다', () => {
    render(<TrashList notes={mockNotes} />);

    expect(screen.getAllByText('복구')).toHaveLength(2);
    expect(screen.getAllByText('영구삭제')).toHaveLength(2);
  });

  it('보기 버튼이 있다', () => {
    render(<TrashList notes={mockNotes} />);

    expect(screen.getAllByText('보기')).toHaveLength(2);
  });
});