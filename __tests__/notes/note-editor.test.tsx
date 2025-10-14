// __tests__/notes/note-editor.test.tsx
// 노트 편집기 컴포넌트 테스트
// 노트 편집 기능과 실시간 저장 기능을 테스트

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteEditor } from '@/components/notes/note-editor';
import { updateNote } from '@/app/notes/[id]/edit/actions';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock server action
jest.mock('@/app/notes/[id]/edit/actions', () => ({
  updateNote: jest.fn(),
}));

const mockNote = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'mock-user-id',
  title: '테스트 노트',
  content: '이것은 테스트 노트의 내용입니다.',
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-02T15:30:00Z'),
};

describe('NoteEditor', () => {
  const mockUpdateNote = updateNote as jest.MockedFunction<typeof updateNote>;
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeAll(() => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateNote.mockResolvedValue({ success: true });
  });

  it('노트 편집기를 올바르게 렌더링한다', () => {
    render(<NoteEditor note={mockNote} />);

    expect(screen.getByDisplayValue('테스트 노트')).toBeInTheDocument();
    expect(screen.getByDisplayValue('이것은 테스트 노트의 내용입니다.')).toBeInTheDocument();
    expect(screen.getByText('뒤로가기')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
  });

  it('제목과 내용을 편집할 수 있다', () => {
    render(<NoteEditor note={mockNote} />);

    const titleInput = screen.getByDisplayValue('테스트 노트');
    const contentTextarea = screen.getByDisplayValue('이것은 테스트 노트의 내용입니다.');

    fireEvent.change(titleInput, { target: { value: '수정된 제목' } });
    fireEvent.change(contentTextarea, { target: { value: '수정된 내용' } });

    expect(titleInput).toHaveValue('수정된 제목');
    expect(contentTextarea).toHaveValue('수정된 내용');
  });

  it('수동 저장 버튼이 작동한다', async () => {
    render(<NoteEditor note={mockNote} />);

    const titleInput = screen.getByDisplayValue('테스트 노트');
    const saveButton = screen.getByText('저장');

    fireEvent.change(titleInput, { target: { value: '수정된 제목' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, {
        title: '수정된 제목',
        content: '이것은 테스트 노트의 내용입니다.',
      });
    });
  });

  it('뒤로가기 버튼이 작동한다', () => {
    render(<NoteEditor note={mockNote} />);

    const backButton = screen.getByText('뒤로가기');
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith(`/notes/${mockNote.id}`);
  });

  it('저장 중 상태를 표시한다', async () => {
    mockUpdateNote.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ success: true }), 100)
    ));

    render(<NoteEditor note={mockNote} />);

    const titleInput = screen.getByDisplayValue('테스트 노트');
    const saveButton = screen.getByText('저장');

    fireEvent.change(titleInput, { target: { value: '수정된 제목' } });
    fireEvent.click(saveButton);

    expect(screen.getByRole('button', { name: '저장 중...' })).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: '저장 중...' })).not.toBeInTheDocument();
    });
  });

  it('저장 실패 시 에러를 표시한다', async () => {
    mockUpdateNote.mockResolvedValue({ 
      success: false, 
      error: '저장 실패' 
    });

    render(<NoteEditor note={mockNote} />);

    const titleInput = screen.getByDisplayValue('테스트 노트');
    const saveButton = screen.getByText('저장');

    fireEvent.change(titleInput, { target: { value: '수정된 제목' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getAllByText('저장 실패')).toHaveLength(2);
    });
  });

  it('변경사항이 있을 때만 저장 버튼이 활성화된다', () => {
    render(<NoteEditor note={mockNote} />);

    const saveButton = screen.getByText('저장');
    expect(saveButton).toBeDisabled();

    const titleInput = screen.getByDisplayValue('테스트 노트');
    fireEvent.change(titleInput, { target: { value: '수정된 제목' } });

    expect(saveButton).not.toBeDisabled();
  });

  it('변경사항이 있을 때 뒤로가기 시 확인 다이얼로그를 표시한다', () => {
    // window.confirm mock
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(<NoteEditor note={mockNote} />);

    const titleInput = screen.getByDisplayValue('테스트 노트');
    const backButton = screen.getByText('뒤로가기');

    fireEvent.change(titleInput, { target: { value: '수정된 제목' } });
    fireEvent.click(backButton);

    expect(confirmSpy).toHaveBeenCalledWith('저장되지 않은 변경사항이 있습니다. 정말 나가시겠습니까?');
    expect(mockBack).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});
