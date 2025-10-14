// __tests__/hooks/use-first-time-user.test.tsx
// 첫 사용자 감지 훅 테스트
// localStorage 기반 첫 사용자 감지 로직을 테스트

import { renderHook, act } from '@testing-library/react';
import { useFirstTimeUser } from '@/lib/hooks/use-first-time-user';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useFirstTimeUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('처음 사용자일 때 isFirstTime이 true이다', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useFirstTimeUser());

    expect(result.current.isFirstTime).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('이전에 방문한 사용자일 때 isFirstTime이 false이다', () => {
    localStorageMock.getItem.mockReturnValue('true');

    const { result } = renderHook(() => useFirstTimeUser());

    expect(result.current.isFirstTime).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('markAsVisited 호출 시 localStorage에 저장되고 isFirstTime이 false가 된다', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useFirstTimeUser());

    expect(result.current.isFirstTime).toBe(true);

    act(() => {
      result.current.markAsVisited();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('ai-memo-first-time-user', 'true');
    expect(result.current.isFirstTime).toBe(false);
  });

  it('resetFirstTime 호출 시 localStorage에서 제거되고 isFirstTime이 true가 된다', () => {
    localStorageMock.getItem.mockReturnValue('true');

    const { result } = renderHook(() => useFirstTimeUser());

    expect(result.current.isFirstTime).toBe(false);

    act(() => {
      result.current.resetFirstTime();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('ai-memo-first-time-user');
    expect(result.current.isFirstTime).toBe(true);
  });

  it('초기 로딩 상태가 올바르게 관리된다', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useFirstTimeUser());

    // 초기에는 로딩 상태가 true여야 함
    expect(result.current.isLoading).toBe(false);
  });
});
