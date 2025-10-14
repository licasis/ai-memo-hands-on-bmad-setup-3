// __tests__/notes/note-pagination.test.tsx
// 노트 페이지네이션 컴포넌트 테스트
// NotePagination 컴포넌트의 페이지네이션 기능을 테스트
// 관련 파일: components/notes/note-pagination.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { NotePagination } from '@/components/notes/note-pagination';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe('NotePagination', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=1&limit=10'));
    mockPush.mockClear();
  });

  it('페이지네이션 정보를 올바르게 표시한다', () => {
    render(
      <NotePagination
        currentPage={2}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
      />
    );
    
    expect(screen.getByText('총 50개 중 11-20개 표시')).toBeInTheDocument();
  });

  it('페이지 번호 버튼들을 올바르게 렌더링한다', () => {
    render(
      <NotePagination
        currentPage={3}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
      />
    );
    
    // 현재 페이지는 기본 스타일
    expect(screen.getByRole('button', { name: '3' })).toHaveClass('bg-primary');
    
    // 다른 페이지들은 outline 스타일
    expect(screen.getByRole('button', { name: '1' })).toHaveClass('border-input');
    expect(screen.getByRole('button', { name: '2' })).toHaveClass('border-input');
  });

  it('이전/다음 버튼이 올바르게 작동한다', () => {
    render(
      <NotePagination
        currentPage={3}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
      />
    );
    
    // 이전 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '이전 페이지로 이동' }));
    expect(mockPush).toHaveBeenCalledWith('/notes?page=2&limit=10');
    
    // 다음 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '다음 페이지로 이동' }));
    expect(mockPush).toHaveBeenCalledWith('/notes?page=4&limit=10');
  });

  it('첫 페이지에서 이전 버튼이 비활성화된다', () => {
    render(
      <NotePagination
        currentPage={1}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
      />
    );
    
    const prevButton = screen.getByRole('button', { name: '이전 페이지로 이동' });
    expect(prevButton).toBeDisabled();
  });

  it('마지막 페이지에서 다음 버튼이 비활성화된다', () => {
    render(
      <NotePagination
        currentPage={10}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
      />
    );
    
    const nextButton = screen.getByRole('button', { name: '다음 페이지로 이동' });
    expect(nextButton).toBeDisabled();
  });

  it('페이지 크기 변경이 올바르게 작동한다', () => {
    render(
      <NotePagination
        currentPage={1}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
      />
    );
    
    // 페이지 크기 선택
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    const option20 = screen.getByText('20');
    fireEvent.click(option20);
    
    expect(mockPush).toHaveBeenCalledWith('/notes?page=1&limit=20');
  });

  it('총 페이지가 1개 이하일 때 렌더링되지 않는다', () => {
    const { container } = render(
      <NotePagination
        currentPage={1}
        totalPages={1}
        totalItems={5}
        itemsPerPage={10}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('페이지 번호 클릭이 올바르게 작동한다', () => {
    render(
      <NotePagination
        currentPage={3}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
      />
    );
    
    // 페이지 5 클릭
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(mockPush).toHaveBeenCalledWith('/notes?page=5&limit=10');
  });
});
