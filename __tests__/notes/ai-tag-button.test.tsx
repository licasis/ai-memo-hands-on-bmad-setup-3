// __tests__/notes/ai-tag-button.test.tsx
// AI 태그 생성 버튼 컴포넌트 단위 테스트
// 태그 생성 기능과 설정 관리를 테스트합니다
// 관련 파일: components/notes/ai-tag-button.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AITagButton } from '@/components/notes/ai-tag-button';

// fetch 모킹
global.fetch = jest.fn();

const mockNote = {
  id: 'test-note-id',
  title: '테스트 노트',
  content: '이것은 테스트용 노트 내용입니다. AI 태그 생성 기능을 테스트하기 위한 긴 텍스트입니다. 개발, 프로그래밍, 웹 개발, React, TypeScript 등의 내용이 포함되어 있습니다.',
};

describe('AITagButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('버튼이 올바르게 렌더링된다', () => {
    render(
      <AITagButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    expect(screen.getByText('AI 태그')).toBeInTheDocument();
    expect(screen.getByLabelText('태그 설정')).toBeInTheDocument();
  });

  it('태그 생성 버튼을 클릭하면 API를 호출한다', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        tags: ['개발', '프로그래밍', 'React', 'TypeScript'],
        count: 4,
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <AITagButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    const tagButton = screen.getByText('AI 태그');
    fireEvent.click(tagButton);

    expect(fetch).toHaveBeenCalledWith('/api/ai/generate-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: mockNote.content,
        maxTags: 6,
        language: 'both',
      }),
    });

    await waitFor(() => {
      expect(screen.getByText('태그 생성 중...')).toBeInTheDocument();
    });
  });

  it('API 호출 중에는 로딩 상태를 표시한다', async () => {
    const mockResponse = new Promise(resolve => 
      setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ tags: ['개발', '프로그래밍'] }),
      }), 100)
    );

    (fetch as jest.Mock).mockReturnValueOnce(mockResponse);

    render(
      <AITagButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    const tagButton = screen.getByText('AI 태그');
    fireEvent.click(tagButton);

    expect(screen.getByText('태그 생성 중...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI 태그' })).toBeDisabled();
  });

  it('API 호출이 실패하면 에러를 표시한다', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({
        error: '태그 생성에 실패했습니다.',
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <AITagButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    const tagButton = screen.getByText('AI 태그');
    fireEvent.click(tagButton);

    await waitFor(() => {
      expect(screen.getByText('태그 생성 실패')).toBeInTheDocument();
      expect(screen.getByText('태그 생성에 실패했습니다.')).toBeInTheDocument();
    });
  });

  it('빈 내용일 때는 버튼이 비활성화된다', () => {
    render(
      <AITagButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent=""
      />
    );

    const tagButton = screen.getByRole('button', { name: 'AI 태그' });
    expect(tagButton).toBeDisabled();
  });

  it('설정 버튼을 클릭하면 설정 다이얼로그가 열린다', () => {
    render(
      <AITagButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    const settingsButton = screen.getByLabelText('태그 설정');
    fireEvent.click(settingsButton);

    expect(screen.getByText('태그 설정')).toBeInTheDocument();
  });

  it('태그 생성 성공 시 모달이 표시된다', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        tags: ['개발', '프로그래밍', 'React'],
        count: 3,
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <AITagButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    const tagButton = screen.getByText('AI 태그');
    fireEvent.click(tagButton);

    await waitFor(() => {
      expect(screen.getByText('AI 태그 생성')).toBeInTheDocument();
      expect(screen.getByText('- 테스트 노트')).toBeInTheDocument();
    });
  });
});
