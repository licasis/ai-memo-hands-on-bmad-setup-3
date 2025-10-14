// __tests__/notes/summary-modal.test.tsx
// 요약 모달 컴포넌트 단위 테스트
// 요약 결과 표시와 사용자 인터랙션을 테스트합니다
// 관련 파일: components/notes/summary-modal.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SummaryModal } from '@/components/notes/summary-modal';

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  summary: '테스트 요약입니다.\n• 첫 번째 포인트\n• 두 번째 포인트',
  error: null,
  noteTitle: '테스트 노트',
  onRegenerate: jest.fn(),
  isRegenerating: false,
};

describe('SummaryModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('모달이 올바르게 렌더링된다', () => {
    render(<SummaryModal {...mockProps} />);

    expect(screen.getByText('AI 요약')).toBeInTheDocument();
    expect(screen.getByText('- 테스트 노트')).toBeInTheDocument();
    expect(screen.getByText(/• 테스트 요약입니다\./)).toBeInTheDocument();
  });

  it('요약 내용이 불릿 포인트로 포맷팅된다', () => {
    render(<SummaryModal {...mockProps} />);

    // 전체 텍스트에서 불릿 포인트가 포함되어 있는지 확인
    const summaryText = screen.getByText(/• 테스트 요약입니다\./);
    expect(summaryText).toBeInTheDocument();
    expect(summaryText.textContent).toContain('• 첫 번째 포인트');
    expect(summaryText.textContent).toContain('• 두 번째 포인트');
  });

  it('복사 버튼이 작동한다', async () => {
    const mockWriteText = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<SummaryModal {...mockProps} />);

    fireEvent.click(screen.getByText('복사'));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(mockProps.summary);
    });
  });

  it('재생성 버튼이 작동한다', () => {
    render(<SummaryModal {...mockProps} />);

    fireEvent.click(screen.getByText('재생성'));

    expect(mockProps.onRegenerate).toHaveBeenCalled();
  });

  it('에러 상태가 올바르게 표시된다', () => {
    const errorProps = {
      ...mockProps,
      summary: null,
      error: '요약 생성에 실패했습니다.',
    };

    render(<SummaryModal {...errorProps} />);

    expect(screen.getByText('요약 생성 실패')).toBeInTheDocument();
    expect(screen.getByText('요약 생성에 실패했습니다.')).toBeInTheDocument();
  });

  it('재생성 중 상태가 올바르게 표시된다', () => {
    const regeneratingProps = {
      ...mockProps,
      isRegenerating: true,
    };

    render(<SummaryModal {...regeneratingProps} />);

    expect(screen.getByText('재생성 중...')).toBeInTheDocument();
  });

  it('닫기 버튼이 작동한다', () => {
    render(<SummaryModal {...mockProps} />);

    fireEvent.click(screen.getByText('닫기'));

    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
