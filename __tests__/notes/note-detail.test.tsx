// __tests__/notes/note-detail.test.tsx
// 노트 상세 컴포넌트 테스트
// NoteDetail 컴포넌트의 렌더링, 액션 버튼, 삭제 다이얼로그를 테스트
// 관련 파일: components/notes/note-detail.tsx, components/notes/delete-confirm-dialog.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteDetail } from '@/components/notes/note-detail';
import { Note } from '@/lib/db/types';

// Mock Next.js router
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockNote: Note = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'user-1',
  title: '테스트 노트',
  content: '이것은 테스트 노트의 내용입니다.\n여러 줄로 구성되어 있습니다.',
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-02T15:30:00Z'),
};

describe('NoteDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('노트 상세 정보를 올바르게 렌더링한다', () => {
    render(<NoteDetail note={mockNote} />);
    
    expect(screen.getByText('테스트 노트')).toBeInTheDocument();
    expect(screen.getByText(/이것은 테스트 노트의 내용입니다/)).toBeInTheDocument();
    expect(screen.getByText(/여러 줄로 구성되어 있습니다/)).toBeInTheDocument();
  });

  it('노트 메타데이터를 올바르게 표시한다', () => {
    render(<NoteDetail note={mockNote} />);
    
    expect(screen.getByText(/작성일:/)).toBeInTheDocument();
    expect(screen.getByText(/수정일:/)).toBeInTheDocument();
  });

  it('액션 버튼들이 올바르게 렌더링된다', () => {
    render(<NoteDetail note={mockNote} />);
    
    expect(screen.getByText('뒤로가기')).toBeInTheDocument();
    expect(screen.getByText('수정')).toBeInTheDocument();
    expect(screen.getByText('삭제')).toBeInTheDocument();
  });

  it('뒤로가기 버튼 클릭 시 router.back()을 호출한다', () => {
    render(<NoteDetail note={mockNote} />);
    
    const backButton = screen.getByText('뒤로가기');
    fireEvent.click(backButton);
    
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('수정 버튼 클릭 시 수정 페이지로 이동한다', () => {
    render(<NoteDetail note={mockNote} />);
    
    const editButton = screen.getByText('수정');
    fireEvent.click(editButton);
    
    expect(mockPush).toHaveBeenCalledWith('/notes/550e8400-e29b-41d4-a716-446655440000/edit');
  });

  it('삭제 버튼 클릭 시 삭제 확인 다이얼로그가 표시된다', () => {
    render(<NoteDetail note={mockNote} />);
    
    const deleteButton = screen.getByText('삭제');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('노트 삭제')).toBeInTheDocument();
    expect(screen.getByText('이 작업은 되돌릴 수 없습니다.')).toBeInTheDocument();
  });

  it('삭제 확인 다이얼로그에서 취소 버튼 클릭 시 다이얼로그가 닫힌다', () => {
    render(<NoteDetail note={mockNote} />);
    
    const deleteButton = screen.getByText('삭제');
    fireEvent.click(deleteButton);
    
    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('노트 삭제')).not.toBeInTheDocument();
  });

  it('삭제 확인 다이얼로그에서 삭제 버튼 클릭 시 API 호출 후 목록으로 이동한다', async () => {
    render(<NoteDetail note={mockNote} />);
    
    const deleteButton = screen.getByRole('button', { name: '삭제' });
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByRole('button', { name: '삭제' });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/notes/550e8400-e29b-41d4-a716-446655440000',
        { method: 'DELETE' }
      );
    });
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/notes');
    });
  });

  it('삭제 API 호출 실패 시 에러를 처리한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, error: '삭제 실패' }),
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<NoteDetail note={mockNote} />);
    
    const deleteButton = screen.getByRole('button', { name: '삭제' });
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByRole('button', { name: '삭제' });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('삭제 실패');
    });

    consoleSpy.mockRestore();
  });
});
