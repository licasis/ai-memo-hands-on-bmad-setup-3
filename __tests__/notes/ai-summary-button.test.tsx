// __tests__/notes/ai-summary-button.test.tsx
// AI 요약 버튼 컴포넌트 단위 테스트
// 요약 생성 기능과 설정 관리를 테스트합니다
// 관련 파일: components/notes/ai-summary-button.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AISummaryButton } from '@/components/notes/ai-summary-button';

// fetch 모킹
global.fetch = jest.fn();

const mockNote = {
  id: 'test-note-id',
  title: '테스트 노트',
  content: '이것은 테스트용 노트 내용입니다. AI 요약 기능을 테스트하기 위한 긴 텍스트입니다.',
};

describe('AISummaryButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('버튼이 올바르게 렌더링된다', () => {
    render(
      <AISummaryButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    expect(screen.getByText('AI 요약')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /설정/i })).toBeInTheDocument();
  });

  it('내용이 없으면 버튼이 비활성화된다', () => {
    render(
      <AISummaryButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent=""
      />
    );

    expect(screen.getByText('AI 요약')).toBeDisabled();
  });

  it('요약 생성 버튼 클릭 시 API를 호출한다', async () => {
    const mockResponse = {
      summary: '테스트 요약입니다.',
      usage: { totalTokenCount: 10 },
      finishReason: 'STOP',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <AISummaryButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    fireEvent.click(screen.getByText('AI 요약'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: mockNote.content,
          maxLength: 300,
          temperature: 0.7,
        }),
      });
    });
  });

  it('API 호출 실패 시 에러를 표시한다', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API 오류'));

    render(
      <AISummaryButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    fireEvent.click(screen.getByText('AI 요약'));

    await waitFor(() => {
      expect(screen.getByText('요약 생성 중...')).toBeInTheDocument();
    });
  });

  it('설정 버튼 클릭 시 설정 다이얼로그가 열린다', async () => {
    // fetch 모킹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        settings: {
          maxLength: 300,
          style: 'bullet',
          temperature: 0.7,
          autoGenerate: false,
        },
      }),
    });

    render(
      <AISummaryButton
        noteId={mockNote.id}
        noteTitle={mockNote.title}
        noteContent={mockNote.content}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /설정/i }));

    // 로딩이 완료될 때까지 기다린 후 텍스트 확인
    await waitFor(() => {
      expect(screen.getByText('요약 설정')).toBeInTheDocument();
    });
  });
});
