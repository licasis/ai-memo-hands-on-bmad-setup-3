// __tests__/trash/restore-confirm-dialog.test.tsx
// 노트 복구 확인 다이얼로그 컴포넌트 테스트
// 복구 다이얼로그의 렌더링과 상호작용을 테스트

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RestoreConfirmDialog } from '@/components/trash/restore-confirm-dialog';
import { restoreNoteAction } from '@/app/trash/actions';

// Mock server action
jest.mock('@/app/trash/actions', () => ({
  restoreNoteAction: jest.fn(),
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

describe('RestoreConfirmDialog', () => {
  const mockRestoreNoteAction = restoreNoteAction as jest.MockedFunction<typeof restoreNoteAction>;
  const mockRefresh = jest.fn();

  beforeAll(() => {
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      refresh: mockRefresh,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRestoreNoteAction.mockResolvedValue({ success: true });
  });

  it('다이얼로그를 올바르게 렌더링한다', () => {
    render(
      <RestoreConfirmDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    expect(screen.getByText('노트 복구')).toBeInTheDocument();
    expect(screen.getByText(/테스트 노트/)).toBeInTheDocument();
    expect(screen.getByText(/노트를 복구하시겠습니까/)).toBeInTheDocument();
  });

  it('복구 버튼 클릭 시 서버 액션을 호출한다', async () => {
    const mockOnOpenChange = jest.fn();
    
    render(
      <RestoreConfirmDialog
        note={mockNote}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const restoreButton = screen.getByText('복구');
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockRestoreNoteAction).toHaveBeenCalledWith(mockNote.id);
    });

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('취소 버튼 클릭 시 다이얼로그를 닫는다', () => {
    const mockOnOpenChange = jest.fn();
    
    render(
      <RestoreConfirmDialog
        note={mockNote}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('복구 실패 시 에러를 처리한다', async () => {
    mockRestoreNoteAction.mockResolvedValue({ 
      success: false, 
      error: '복구 실패' 
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <RestoreConfirmDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    const restoreButton = screen.getByText('복구');
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('복구 실패:', '복구 실패');
    });

    consoleSpy.mockRestore();
  });

  it('복구 중 상태를 표시한다', async () => {
    mockRestoreNoteAction.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ success: true }), 100)
    ));

    render(
      <RestoreConfirmDialog
        note={mockNote}
        open={true}
        onOpenChange={jest.fn()}
      />
    );

    const restoreButton = screen.getByText('복구');
    fireEvent.click(restoreButton);

    expect(screen.getByText('복구 중...')).toBeInTheDocument();
    expect(restoreButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('복구 중...')).not.toBeInTheDocument();
    });
  });
});
