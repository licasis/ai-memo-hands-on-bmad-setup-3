// __tests__/notes/create-note.test.tsx
// 노트 생성 기능 테스트
// 폼 유효성 검사, 서버 액션, 통합 테스트를 포함
// 관련 파일: components/notes/create-note-form.tsx, app/notes/create/actions.ts

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateNoteForm from '@/components/notes/create-note-form';
import { createNote } from '@/app/notes/create/actions';

// 서버 액션 모킹
jest.mock('@/app/notes/create/actions', () => ({
  createNote: jest.fn(),
}));

// Next.js 모듈 모킹
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

const mockCreateNote = createNote as jest.MockedFunction<typeof createNote>;

describe('CreateNoteForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('폼이 올바르게 렌더링된다', () => {
    render(<CreateNoteForm />);
    
    expect(screen.getByLabelText('제목 *')).toBeInTheDocument();
    expect(screen.getByLabelText('본문 *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '노트 저장' })).toBeInTheDocument();
  });

  it('필수 필드 검증이 작동한다', async () => {
    const user = userEvent.setup();
    render(<CreateNoteForm />);
    
    const submitButton = screen.getByRole('button', { name: '노트 저장' });
    await user.click(submitButton);
    
    expect(screen.getByText('제목을 입력해주세요')).toBeInTheDocument();
    expect(screen.getByText('본문을 입력해주세요')).toBeInTheDocument();
  });

  it('제목 길이 제한이 작동한다', async () => {
    const user = userEvent.setup();
    render(<CreateNoteForm />);
    
    const titleInput = screen.getByLabelText('제목 *');
    const longTitle = 'a'.repeat(256);
    
    await user.type(titleInput, longTitle);
    await user.click(screen.getByRole('button', { name: '노트 저장' }));
    
    expect(screen.getByText('제목은 255자 이하로 입력해주세요')).toBeInTheDocument();
  });

  it('유효한 데이터로 노트 생성이 성공한다', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    
    mockCreateNote.mockResolvedValue({
      success: true,
      noteId: 'test-note-id',
    });
    
    render(<CreateNoteForm onSuccess={mockOnSuccess} />);
    
    const titleInput = screen.getByLabelText('제목 *');
    const contentInput = screen.getByLabelText('본문 *');
    const submitButton = screen.getByRole('button', { name: '노트 저장' });
    
    await user.type(titleInput, '테스트 제목');
    await user.type(contentInput, '테스트 본문');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateNote).toHaveBeenCalledWith({
        title: '테스트 제목',
        content: '테스트 본문',
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('노트 생성 실패 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup();
    
    mockCreateNote.mockResolvedValue({
      success: false,
      error: '서버 오류가 발생했습니다.',
    });
    
    render(<CreateNoteForm />);
    
    const titleInput = screen.getByLabelText('제목 *');
    const contentInput = screen.getByLabelText('본문 *');
    const submitButton = screen.getByRole('button', { name: '노트 저장' });
    
    await user.type(titleInput, '테스트 제목');
    await user.type(contentInput, '테스트 본문');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('서버 오류가 발생했습니다.')).toBeInTheDocument();
    });
  });

  it('제출 중 로딩 상태가 표시된다', async () => {
    const user = userEvent.setup();
    
    // Promise를 resolve하지 않아서 로딩 상태를 유지
    mockCreateNote.mockImplementation(() => new Promise(() => {}));
    
    render(<CreateNoteForm />);
    
    const titleInput = screen.getByLabelText('제목 *');
    const contentInput = screen.getByLabelText('본문 *');
    const submitButton = screen.getByRole('button', { name: '노트 저장' });
    
    await user.type(titleInput, '테스트 제목');
    await user.type(contentInput, '테스트 본문');
    await user.click(submitButton);
    
    expect(screen.getByText('저장 중...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('취소 버튼이 작동한다', async () => {
    const user = userEvent.setup();
    const mockOnCancel = jest.fn();
    
    render(<CreateNoteForm onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: '취소' });
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('폼 제출 후 성공 시 폼이 리셋된다', async () => {
    const user = userEvent.setup();
    
    mockCreateNote.mockResolvedValue({
      success: true,
      noteId: 'test-note-id',
    });
    
    render(<CreateNoteForm />);
    
    const titleInput = screen.getByLabelText('제목 *');
    const contentInput = screen.getByLabelText('본문 *');
    const submitButton = screen.getByRole('button', { name: '노트 저장' });
    
    await user.type(titleInput, '테스트 제목');
    await user.type(contentInput, '테스트 본문');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(contentInput).toHaveValue('');
    });
  });
});
