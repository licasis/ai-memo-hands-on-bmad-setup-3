// __tests__/notes/auto-save-indicator.test.tsx
// 자동 저장 상태 표시 컴포넌트 테스트
// 저장 상태와 에러 상태를 올바르게 표시하는지 테스트

import React from 'react';
import { render, screen } from '@testing-library/react';
import { AutoSaveIndicator } from '@/components/notes/auto-save-indicator';

describe('AutoSaveIndicator', () => {
  it('저장 중 상태를 표시한다', () => {
    render(
      <AutoSaveIndicator
        isSaving={true}
        lastSaved={null}
        hasUnsavedChanges={false}
        error={null}
      />
    );

    expect(screen.getByText('저장 중...')).toBeInTheDocument();
  });

  it('저장 완료 상태를 표시한다', () => {
    const lastSaved = new Date('2024-01-01T10:00:00Z');
    
    render(
      <AutoSaveIndicator
        isSaving={false}
        lastSaved={lastSaved}
        hasUnsavedChanges={false}
        error={null}
      />
    );

    expect(screen.getByText(/저장됨/)).toBeInTheDocument();
  });

  it('저장 대기 상태를 표시한다', () => {
    render(
      <AutoSaveIndicator
        isSaving={false}
        lastSaved={null}
        hasUnsavedChanges={true}
        error={null}
      />
    );

    expect(screen.getByText('저장 대기 중')).toBeInTheDocument();
  });

  it('에러 상태를 표시한다', () => {
    render(
      <AutoSaveIndicator
        isSaving={false}
        lastSaved={null}
        hasUnsavedChanges={false}
        error="저장 실패"
      />
    );

    expect(screen.getByText('저장 실패')).toBeInTheDocument();
  });

  it('아무 상태도 없을 때는 아무것도 렌더링하지 않는다', () => {
    const { container } = render(
      <AutoSaveIndicator
        isSaving={false}
        lastSaved={null}
        hasUnsavedChanges={false}
        error={null}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('마지막 저장 시간을 올바르게 포맷한다', () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    
    render(
      <AutoSaveIndicator
        isSaving={false}
        lastSaved={oneMinuteAgo}
        hasUnsavedChanges={false}
        error={null}
      />
    );

    expect(screen.getByText(/1분 전에 저장됨/)).toBeInTheDocument();
  });
});
