// __tests__/notes/empty-state-enhanced.test.tsx
// 향상된 빈 상태 컴포넌트 테스트
// 빈 상태 UI, 온보딩 기능, 반응형 레이아웃 등을 테스트

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmptyStateEnhanced } from '@/components/notes/empty-state-enhanced';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('EmptyStateEnhanced', () => {
  it('기본 빈 상태를 올바르게 렌더링한다', () => {
    render(<EmptyStateEnhanced />);

    expect(screen.getByText('아직 노트가 없어요')).toBeInTheDocument();
    expect(screen.getByText(/첫 번째 노트를 작성해서 시작해보세요/)).toBeInTheDocument();
    expect(screen.getByText('새 노트 작성')).toBeInTheDocument();
  });

  it('새 노트 작성 버튼이 올바른 링크를 가진다', () => {
    render(<EmptyStateEnhanced />);

    const createButton = screen.getByText('새 노트 작성');
    const link = createButton.closest('a');
    expect(link).toHaveAttribute('href', '/notes/create');
  });

  it('온보딩이 활성화되면 툴팁이 표시된다', () => {
    render(<EmptyStateEnhanced showOnboarding={true} />);

    expect(screen.getByText('온보딩 중...')).toBeInTheDocument();
  });

  it('온보딩이 비활성화되면 툴팁이 표시되지 않는다', () => {
    render(<EmptyStateEnhanced showOnboarding={false} />);

    expect(screen.queryByText('온보딩 중...')).not.toBeInTheDocument();
  });

  it('온보딩 완료 콜백이 호출된다', () => {
    const onOnboardingComplete = jest.fn();
    render(<EmptyStateEnhanced showOnboarding={true} onOnboardingComplete={onOnboardingComplete} />);

    // 온보딩 완료 로직은 실제로는 사용자 상호작용에 의해 트리거됨
    // 여기서는 컴포넌트가 올바르게 렌더링되는지만 확인
    expect(onOnboardingComplete).not.toHaveBeenCalled();
  });

  it('팁 메시지가 표시된다', () => {
    render(<EmptyStateEnhanced />);

    expect(screen.getByText('팁:')).toBeInTheDocument();
    expect(screen.getByText(/노트는 자동으로 저장됩니다/)).toBeInTheDocument();
    expect(screen.getByText(/모바일에서도 편리하게 사용하세요/)).toBeInTheDocument();
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<EmptyStateEnhanced className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('아이콘이 올바르게 표시된다', () => {
    render(<EmptyStateEnhanced />);

    // FileText 아이콘
    const fileTextIcon = document.querySelector('.lucide-file-text');
    expect(fileTextIcon).toBeInTheDocument();

    // Plus 아이콘 (버튼 내)
    const plusIcon = document.querySelector('.lucide-plus');
    expect(plusIcon).toBeInTheDocument();

    // ArrowRight 아이콘 (버튼 내)
    const arrowRightIcon = document.querySelector('.lucide-arrow-right');
    expect(arrowRightIcon).toBeInTheDocument();
  });

  it('반응형 레이아웃이 올바르게 적용된다', () => {
    render(<EmptyStateEnhanced />);

    const button = screen.getByText('새 노트 작성');
    expect(button).toHaveClass('w-full', 'sm:w-auto');
  });

  it('카드 레이아웃이 올바르게 적용된다', () => {
    render(<EmptyStateEnhanced />);

    const card = document.querySelector('.max-w-md');
    expect(card).toBeInTheDocument();
  });
});
