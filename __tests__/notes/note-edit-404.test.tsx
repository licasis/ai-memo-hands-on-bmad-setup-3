// __tests__/notes/note-edit-404.test.tsx
// 노트 편집 404 페이지 테스트
// 편집할 수 없는 노트에 접근했을 때의 404 페이지를 테스트

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import NotFound from '@/app/notes/[id]/edit/not-found';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NoteEdit 404', () => {
  const mockPush = jest.fn();
  
  beforeAll(() => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({ push: mockPush });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('404 페이지를 올바르게 렌더링한다', () => {
    render(<NotFound />);

    expect(screen.getByText('노트를 편집할 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText('요청하신 노트가 존재하지 않거나 편집 권한이 없습니다.')).toBeInTheDocument();
  });

  it('404 페이지에 적절한 아이콘이 표시된다', () => {
    render(<NotFound />);

    // Edit3 아이콘 컨테이너가 있는지 확인
    const iconContainer = document.querySelector('.w-24.h-24.bg-orange-100.rounded-full');
    expect(iconContainer).toBeInTheDocument();
  });

  it('노트 목록으로 돌아가기 버튼이 있다', () => {
    render(<NotFound />);

    const backButton = screen.getByText('노트 목록으로 돌아가기');
    expect(backButton).toBeInTheDocument();
    expect(backButton.closest('a')).toHaveAttribute('href', '/notes');
  });

  it('새 노트 작성 버튼이 있다', () => {
    render(<NotFound />);

    const createButton = screen.getByText('새 노트 작성');
    expect(createButton).toBeInTheDocument();
    expect(createButton.closest('a')).toHaveAttribute('href', '/notes/create');
  });

  it('버튼들이 올바른 스타일을 가진다', () => {
    render(<NotFound />);

    const backButton = screen.getByText('노트 목록으로 돌아가기');
    const createButton = screen.getByText('새 노트 작성');

    expect(backButton).toHaveClass('inline-flex', 'items-center', 'gap-2');
    expect(createButton).toHaveClass('inline-flex', 'items-center', 'gap-2');
  });
});
