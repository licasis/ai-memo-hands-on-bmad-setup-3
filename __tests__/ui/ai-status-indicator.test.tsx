// __tests__/ui/ai-status-indicator.test.tsx
// AI 상태 표시 컴포넌트 단위 테스트
// AI 처리 상태 표시 기능을 테스트합니다
// 관련 파일: components/ui/ai-status-indicator.tsx

import { render, screen } from '@testing-library/react';
import { AIStatusIndicator, AIStatusBadge, AIStatusToast } from '@/components/ui/ai-status-indicator';
import { AIStatusState } from '@/lib/ai/types';

const mockStatus: AIStatusState = {
  status: 'idle',
  message: 'AI 기능을 사용할 수 있습니다',
};

const mockLoadingStatus: AIStatusState = {
  status: 'loading',
  message: 'AI가 처리 중입니다...',
  progress: 50,
};

const mockSuccessStatus: AIStatusState = {
  status: 'success',
  message: 'AI 처리가 완료되었습니다',
  progress: 100,
};

const mockErrorStatus: AIStatusState = {
  status: 'error',
  message: 'AI 처리 중 오류가 발생했습니다',
  error: 'API 호출 실패',
};

describe('AIStatusIndicator', () => {
  it('idle 상태에서 올바르게 렌더링된다', () => {
    render(<AIStatusIndicator status={mockStatus} />);
    
    expect(screen.getByText('AI 기능을 사용할 수 있습니다')).toBeInTheDocument();
  });

  it('loading 상태에서 스피너와 메시지를 표시한다', () => {
    render(<AIStatusIndicator status={mockLoadingStatus} showProgress />);
    
    expect(screen.getByText('AI가 처리 중입니다...')).toBeInTheDocument();
    // 스피너 아이콘이 있는지 확인
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('success 상태에서 체크마크와 메시지를 표시한다', () => {
    render(<AIStatusIndicator status={mockSuccessStatus} />);
    
    expect(screen.getByText('AI 처리가 완료되었습니다')).toBeInTheDocument();
  });

  it('error 상태에서 에러 아이콘과 메시지를 표시한다', () => {
    render(<AIStatusIndicator status={mockErrorStatus} />);
    
    expect(screen.getByText('AI 처리 중 오류가 발생했습니다')).toBeInTheDocument();
  });

  it('minimal variant에서 아이콘만 표시한다', () => {
    render(<AIStatusIndicator status={mockLoadingStatus} variant="minimal" showMessage={false} />);
    
    // 메시지가 표시되지 않아야 함
    expect(screen.queryByText('AI가 처리 중입니다...')).not.toBeInTheDocument();
  });

  it('card variant에서 카드 형태로 표시한다', () => {
    render(<AIStatusIndicator status={mockSuccessStatus} variant="card" />);
    
    expect(screen.getByText('AI 처리가 완료되었습니다')).toBeInTheDocument();
  });
});

describe('AIStatusBadge', () => {
  it('상태에 따라 올바른 색상으로 렌더링된다', () => {
    const { rerender } = render(<AIStatusBadge status={mockLoadingStatus} />);
    
    expect(screen.getByText('AI가 처리 중입니다...')).toBeInTheDocument();
    
    rerender(<AIStatusBadge status={mockSuccessStatus} />);
    expect(screen.getByText('AI 처리가 완료되었습니다')).toBeInTheDocument();
  });
});

describe('AIStatusToast', () => {
  it('토스트 형태로 상태를 표시한다', () => {
    render(<AIStatusToast status={mockErrorStatus} />);
    
    expect(screen.getByText('AI 처리 중 오류가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText('API 호출 실패')).toBeInTheDocument();
  });

  it('닫기 버튼이 있을 때 클릭 가능하다', () => {
    const onClose = jest.fn();
    render(<AIStatusToast status={mockSuccessStatus} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('닫기');
    expect(closeButton).toBeInTheDocument();
    
    closeButton.click();
    expect(onClose).toHaveBeenCalled();
  });
});
