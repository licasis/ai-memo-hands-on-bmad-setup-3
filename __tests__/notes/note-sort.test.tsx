// __tests__/notes/note-sort.test.tsx
// 노트 정렬 컴포넌트 테스트
// 정렬 옵션 선택, 변경 이벤트 처리, URL 업데이트 등을 테스트

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteSort } from '@/components/notes/note-sort';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('NoteSort', () => {
  const mockPush = jest.fn();
  const mockPathname = '/notes';
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('기본 정렬 옵션을 올바르게 렌더링한다', () => {
    render(<NoteSort />);

    expect(screen.getByText('정렬:')).toBeInTheDocument();
    expect(screen.getByText('최신순')).toBeInTheDocument();
  });

  it('현재 정렬 옵션을 올바르게 표시한다', () => {
    render(<NoteSort currentSort="title-asc" />);

    expect(screen.getByText('제목 A-Z')).toBeInTheDocument();
  });

  it('정렬 옵션 드롭다운을 열고 닫을 수 있다', () => {
    render(<NoteSort />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByText('오래된순')).toBeInTheDocument();
    expect(screen.getByText('작성일 최신순')).toBeInTheDocument();
    expect(screen.getByText('제목 A-Z')).toBeInTheDocument();
  });

  it('정렬 옵션 변경 시 URL이 업데이트된다', async () => {
    render(<NoteSort />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const titleAscOption = screen.getByText('제목 A-Z');
    fireEvent.click(titleAscOption);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/notes?sort=title-asc&page=1');
    });
  });

  it('정렬 변경 시 페이지가 1로 리셋된다', async () => {
    const searchParamsWithPage = new URLSearchParams('page=3');
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsWithPage);

    render(<NoteSort />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const titleDescOption = screen.getByText('제목 Z-A');
    fireEvent.click(titleDescOption);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/notes?page=1&sort=title-desc');
    });
  });

  it('모든 정렬 옵션이 올바르게 표시된다', () => {
    render(<NoteSort />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getAllByText('최신순')).toHaveLength(2); // 트리거와 옵션
    expect(screen.getByText('오래된순')).toBeInTheDocument();
    expect(screen.getByText('작성일 최신순')).toBeInTheDocument();
    expect(screen.getByText('작성일 오래된순')).toBeInTheDocument();
    expect(screen.getByText('제목 A-Z')).toBeInTheDocument();
    expect(screen.getByText('제목 Z-A')).toBeInTheDocument();
  });

  it('정렬 아이콘이 올바르게 표시된다', () => {
    render(<NoteSort />);

    // Calendar 아이콘 (최신순)
    const calendarIcons = document.querySelectorAll('.lucide-calendar');
    expect(calendarIcons.length).toBeGreaterThan(0);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // FileText 아이콘 (제목순)
    const fileTextIcons = document.querySelectorAll('.lucide-file-text');
    expect(fileTextIcons.length).toBeGreaterThan(0);
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<NoteSort className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('잘못된 정렬 옵션에 대해 기본값을 사용한다', () => {
    render(<NoteSort currentSort="invalid-sort" as any />);

    expect(screen.getByText('최신순')).toBeInTheDocument();
  });
});
