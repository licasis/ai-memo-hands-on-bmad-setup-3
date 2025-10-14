// __tests__/notes/onboarding-tooltip.test.tsx
// 온보딩 툴팁 컴포넌트 테스트
// 툴팁 표시, 위치, 내용 등을 테스트

import { render, screen } from '@testing-library/react';
import { OnboardingTooltip } from '@/components/notes/onboarding-tooltip';

describe('OnboardingTooltip', () => {
  it('isVisible이 false일 때 툴팁이 표시되지 않는다', () => {
    render(
      <OnboardingTooltip content="테스트 툴팁" isVisible={false}>
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    expect(screen.getByText('테스트 버튼')).toBeInTheDocument();
    expect(screen.queryByText('테스트 툴팁')).not.toBeInTheDocument();
  });

  it('isVisible이 true일 때 툴팁이 표시된다', () => {
    render(
      <OnboardingTooltip content="테스트 툴팁" isVisible={true}>
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    expect(screen.getByText('테스트 버튼')).toBeInTheDocument();
    expect(screen.getByText('테스트 툴팁')).toBeInTheDocument();
  });

  it('다양한 위치에 툴팁이 올바르게 표시된다', () => {
    const { rerender } = render(
      <OnboardingTooltip content="테스트 툴팁" isVisible={true} placement="top">
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    const tooltip = screen.getByText('테스트 툴팁');
    expect(tooltip).toHaveClass('bottom-full', 'left-1/2');

    rerender(
      <OnboardingTooltip content="테스트 툴팁" isVisible={true} placement="bottom">
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    expect(tooltip).toHaveClass('top-full', 'left-1/2');

    rerender(
      <OnboardingTooltip content="테스트 툴팁" isVisible={true} placement="left">
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    expect(tooltip).toHaveClass('right-full', 'top-1/2');

    rerender(
      <OnboardingTooltip content="테스트 툴팁" isVisible={true} placement="right">
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    expect(tooltip).toHaveClass('left-full', 'top-1/2');
  });

  it('커스텀 className이 적용된다', () => {
    render(
      <OnboardingTooltip 
        content="테스트 툴팁" 
        isVisible={true} 
        className="custom-class"
      >
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    const container = screen.getByText('테스트 버튼').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('툴팁 내용이 올바르게 표시된다', () => {
    const content = '첫 번째 노트를 작성해보세요!';
    render(
      <OnboardingTooltip content={content} isVisible={true}>
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('툴팁이 올바른 스타일을 가진다', () => {
    render(
      <OnboardingTooltip content="테스트 툴팁" isVisible={true}>
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    const tooltip = screen.getByText('테스트 툴팁');
    expect(tooltip).toHaveClass(
      'absolute',
      'z-50',
      'px-3',
      'py-2',
      'text-sm',
      'text-white',
      'bg-gray-900',
      'rounded-lg',
      'shadow-lg',
      'whitespace-nowrap'
    );
  });

  it('화살표가 올바른 위치에 표시된다', () => {
    render(
      <OnboardingTooltip content="테스트 툴팁" isVisible={true} placement="top">
        <button>테스트 버튼</button>
      </OnboardingTooltip>
    );

    const arrow = document.querySelector('.w-0.h-0.border-4');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveClass('top-full', 'left-1/2');
  });
});
