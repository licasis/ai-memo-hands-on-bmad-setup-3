// __tests__/notes/tag-modal.test.tsx
// 태그 모달 컴포넌트 단위 테스트
// 태그 결과 표시와 사용자 인터랙션을 테스트합니다
// 관련 파일: components/notes/tag-modal.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TagModal } from '@/components/notes/tag-modal';

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  tags: ['개발', '프로그래밍', 'React', 'TypeScript'],
  error: null,
  noteTitle: '테스트 노트',
  onRegenerate: jest.fn(),
  onApplyTags: jest.fn(),
  isRegenerating: false,
};

describe('TagModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('모달이 올바르게 렌더링된다', () => {
    render(<TagModal {...mockProps} />);

    expect(screen.getByText('AI 태그 생성')).toBeInTheDocument();
    expect(screen.getByText('- 테스트 노트')).toBeInTheDocument();
    expect(screen.getByText('개발')).toBeInTheDocument();
    expect(screen.getByText('프로그래밍')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('태그를 클릭하면 선택/해제된다', () => {
    render(<TagModal {...mockProps} />);

    const tag = screen.getByText('개발');
    fireEvent.click(tag);

    // 선택된 태그는 기본 스타일로 표시됨
    expect(tag).toHaveClass('bg-primary');
  });

  it('태그 삭제 버튼을 클릭하면 태그가 제거된다', () => {
    render(<TagModal {...mockProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const firstDeleteButton = deleteButtons[0]; // 첫 번째 태그의 삭제 버튼
    
    fireEvent.click(firstDeleteButton);

    expect(screen.queryByText('개발')).not.toBeInTheDocument();
  });

  it('새 태그를 추가할 수 있다', () => {
    render(<TagModal {...mockProps} />);

    const input = screen.getByPlaceholderText('새 태그 입력');
    const addButton = screen.getByText('추가');

    fireEvent.change(input, { target: { value: '새로운태그' } });
    fireEvent.click(addButton);

    expect(screen.getByText('새로운태그')).toBeInTheDocument();
  });

  it('Enter 키로 새 태그를 추가할 수 있다', () => {
    render(<TagModal {...mockProps} />);

    const input = screen.getByPlaceholderText('새 태그 입력');

    fireEvent.change(input, { target: { value: 'Enter태그' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Enter태그')).toBeInTheDocument();
  });

  it('적용하기 버튼을 클릭하면 선택된 태그가 전달된다', () => {
    render(<TagModal {...mockProps} />);

    const applyButton = screen.getByText('적용하기');
    fireEvent.click(applyButton);

    expect(mockProps.onApplyTags).toHaveBeenCalledWith(['개발', '프로그래밍', 'React', 'TypeScript']);
  });

  it('재생성 버튼을 클릭하면 재생성 함수가 호출된다', () => {
    render(<TagModal {...mockProps} />);

    const regenerateButton = screen.getByText('재생성');
    fireEvent.click(regenerateButton);

    expect(mockProps.onRegenerate).toHaveBeenCalled();
  });

  it('에러가 있을 때 에러 메시지를 표시한다', () => {
    const errorProps = {
      ...mockProps,
      error: '태그 생성에 실패했습니다.',
      tags: [],
    };

    render(<TagModal {...errorProps} />);

    expect(screen.getByText('태그 생성 실패')).toBeInTheDocument();
    expect(screen.getByText('태그 생성에 실패했습니다.')).toBeInTheDocument();
  });

  it('재생성 중일 때 로딩 상태를 표시한다', () => {
    const regeneratingProps = {
      ...mockProps,
      isRegenerating: true,
    };

    render(<TagModal {...regeneratingProps} />);

    expect(screen.getByText('재생성 중...')).toBeInTheDocument();
  });

  it('선택된 태그가 없을 때 적용하기 버튼이 비활성화된다', () => {
    const noTagsProps = {
      ...mockProps,
      tags: [],
    };

    render(<TagModal {...noTagsProps} />);

    const applyButton = screen.getByText('적용하기');
    expect(applyButton).toBeDisabled();
  });

  it('닫기 버튼을 클릭하면 onClose가 호출된다', () => {
    render(<TagModal {...mockProps} />);

    const closeButton = screen.getByText('취소');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
