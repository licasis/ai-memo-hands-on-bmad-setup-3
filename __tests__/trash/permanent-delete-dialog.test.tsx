// __tests__/trash/permanent-delete-dialog.test.tsx
// 노트 영구 삭제 확인 다이얼로그 컴포넌트 테스트
// 영구 삭제 다이얼로그의 렌더링과 상호작용을 테스트

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PermanentDeleteDialog } from '@/components/trash/permanent-delete-dialog';
import { permanentDeleteNoteAction } from '@/app/trash/actions';

// Mock server action
jest.mock('@/app/trash/actions', () => ({
  permanentDeleteNoteAction: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

const mockNote = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: '테스트 노트',
};

describe('PermanentDeleteDialog', () => {
  const mockPermanentDeleteNoteAction = permanentDeleteNoteAction as jest.MockedFunction<typeof permanentDeleteNoteAction>;
  const mockRefresh = jest.fn();

  beforeAll(() => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      refresh: mockRefresh,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPermanentDeleteNoteAction.mockResolvedValue({ success: true });
  });

  it('다이얼로그를 올바르게 렌더링한다', () => {
    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    expect(screen.getByText('노트 영구 삭제')).toBeInTheDocument();
    expect(screen.getByText(/테스트 노트/)).toBeInTheDocument();
    expect(screen.getByText(/노트를 영구적으로 삭제하시겠습니까/)).toBeInTheDocument();
    expect(screen.getByText('이 작업은 되돌릴 수 없습니다.')).toBeInTheDocument();
  });

  it('확인 텍스트 입력 필드가 있다', () => {
    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText('영구삭제');
    expect(input).toBeInTheDocument();
  });

  it('올바른 확인 텍스트 입력 시 영구 삭제 버튼이 활성화된다', () => {
    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText('영구삭제');
    const deleteButton = screen.getByText('영구 삭제');

    expect(deleteButton).toBeDisabled();

    fireEvent.change(input, { target: { value: '영구삭제' } });

    expect(deleteButton).not.toBeDisabled();
  });

  it('잘못된 확인 텍스트 입력 시 영구 삭제 버튼이 비활성화된다', () => {
    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText('영구삭제');
    const deleteButton = screen.getByText('영구 삭제');

    fireEvent.change(input, { target: { value: '잘못된 텍스트' } });

    expect(deleteButton).toBeDisabled();
  });

  it('올바른 확인 텍스트 입력 후 영구 삭제 버튼 클릭 시 서버 액션을 호출한다', async () => {
    const mockOnOpenChange = jest.fn();
    
    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const input = screen.getByPlaceholderText('영구삭제');
    const deleteButton = screen.getByText('영구 삭제');

    fireEvent.change(input, { target: { value: '영구삭제' } });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockPermanentDeleteNoteAction).toHaveBeenCalledWith(mockNote.id);
    });

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('취소 버튼 클릭 시 다이얼로그를 닫고 입력을 초기화한다', () => {
    const mockOnOpenChange = jest.fn();
    
    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const input = screen.getByPlaceholderText('영구삭제');
    const cancelButton = screen.getByText('취소');

    fireEvent.change(input, { target: { value: '영구삭제' } });
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    
    // 다이얼로그가 다시 열릴 때 입력이 초기화되는지 확인
    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );
    
    const newInput = screen.getAllByPlaceholderText('영구삭제')[0];
    expect(newInput).toHaveValue('');
  });

  it('영구 삭제 중 상태를 표시한다', async () => {
    mockPermanentDeleteNoteAction.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ success: true }), 100)
    ));

    render(
      <PermanentDeleteDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText('영구삭제');
    const deleteButton = screen.getByText('영구 삭제');

    fireEvent.change(input, { target: { value: '영구삭제' } });
    fireEvent.click(deleteButton);

    expect(screen.getByText('삭제 중...')).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('삭제 중...')).not.toBeInTheDocument();
    });
  });
});
