// __tests__/notes/note-detail-404.test.tsx
// 노트 상세 페이지 404 에러 테스트
// 존재하지 않는 노트 접근 시 404 페이지가 표시되는지 테스트
// 관련 파일: app/notes/[id]/not-found.tsx, app/notes/[id]/page.tsx

import { render, screen } from '@testing-library/react';
import NotFound from '@/app/notes/[id]/not-found';

describe('NoteDetail 404', () => {
  it('404 페이지를 올바르게 렌더링한다', () => {
    render(<NotFound />);
    
    expect(screen.getByText('노트를 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText('요청하신 노트가 존재하지 않거나 삭제되었습니다.')).toBeInTheDocument();
  });

  it('404 페이지에 적절한 아이콘이 표시된다', () => {
    render(<NotFound />);
    
    // FileX 아이콘 컨테이너가 있는지 확인
    const iconContainer = document.querySelector('.w-24.h-24.bg-red-100.rounded-full');
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

  it('버튼들이 올바른 스타일을 가지고 있다', () => {
    render(<NotFound />);
    
    const backButton = screen.getByText('노트 목록으로 돌아가기');
    const createButton = screen.getByText('새 노트 작성');
    
    expect(backButton).toHaveClass('inline-flex', 'items-center', 'gap-2');
    expect(createButton).toHaveClass('inline-flex', 'items-center', 'gap-2');
  });
});
