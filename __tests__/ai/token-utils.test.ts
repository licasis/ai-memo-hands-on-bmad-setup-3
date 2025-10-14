// __tests__/ai/token-utils.test.ts
// 토큰 계산 및 제한 관리 테스트
// 토큰 계산 로직과 제한 검증을 테스트합니다
// 관련 파일: lib/ai/token-utils.ts

import {
  estimateTokens,
  isTokenLimitExceeded,
  truncateToTokenLimit,
  truncateToTokenLimitBySentences,
  getTokenUsageInfo,
} from '@/lib/ai/token-utils';

describe('Token Utils', () => {
  describe('estimateTokens', () => {
    it('영어 텍스트의 토큰을 계산한다', () => {
      const text = 'Hello world this is a test';
      const tokens = estimateTokens(text);
      
      // 25자 / 4 = 6.25, 올림하면 7
      expect(tokens).toBe(7);
    });

    it('한국어 텍스트의 토큰을 계산한다', () => {
      const text = '안녕하세요 이것은 테스트입니다';
      const tokens = estimateTokens(text);
      
      // 한국어는 1.2배 적용: 16자 / 4 * 1.2 = 4.8, 올림하면 5
      expect(tokens).toBe(5);
    });

    it('빈 문자열의 토큰은 0이다', () => {
      expect(estimateTokens('')).toBe(0);
    });

    it('null이나 undefined의 토큰은 0이다', () => {
      expect(estimateTokens(null as any)).toBe(0);
      expect(estimateTokens(undefined as any)).toBe(0);
    });

    it('혼합 언어 텍스트의 토큰을 계산한다', () => {
      const text = 'Hello 안녕하세요 test';
      const tokens = estimateTokens(text);
      
      // 한국어가 포함되어 있으므로 1.2배 적용
      expect(tokens).toBeGreaterThan(0);
    });
  });

  describe('isTokenLimitExceeded', () => {
    it('토큰 제한을 초과하지 않으면 false를 반환한다', () => {
      const text = 'Short text';
      const result = isTokenLimitExceeded(text, 100);
      
      expect(result).toBe(false);
    });

    it('토큰 제한을 초과하면 true를 반환한다', () => {
      const text = 'a'.repeat(1000); // 250 토큰 정도
      const result = isTokenLimitExceeded(text, 100);
      
      expect(result).toBe(true);
    });

    it('기본 제한값 8000을 사용한다', () => {
      const text = 'a'.repeat(40000); // 10k 토큰 정도
      const result = isTokenLimitExceeded(text);
      
      expect(result).toBe(true);
    });
  });

  describe('truncateToTokenLimit', () => {
    it('제한 내 텍스트는 그대로 반환한다', () => {
      const text = 'Short text';
      const result = truncateToTokenLimit(text, 100);
      
      expect(result).toBe(text);
    });

    it('제한을 초과하는 텍스트를 자른다', () => {
      const text = 'a'.repeat(1000);
      const result = truncateToTokenLimit(text, 100);
      
      expect(result.length).toBeLessThan(text.length);
      expect(estimateTokens(result)).toBeLessThanOrEqual(100);
    });

    it('이진 탐색으로 정확한 길이를 찾는다', () => {
      const text = 'a'.repeat(1000);
      const result = truncateToTokenLimit(text, 50);
      
      // 정확히 50 토큰에 가까운 길이여야 함
      const tokens = estimateTokens(result);
      expect(tokens).toBeLessThanOrEqual(50);
      expect(tokens).toBeGreaterThan(40); // 너무 짧지 않아야 함
    });
  });

  describe('truncateToTokenLimitBySentences', () => {
    it('문장 단위로 텍스트를 자른다', () => {
      const text = 'First sentence. Second sentence. Third sentence.';
      const result = truncateToTokenLimitBySentences(text, 20);
      
      expect(result).toContain('First sentence');
      expect(result).toContain('Second sentence');
      expect(estimateTokens(result)).toBeLessThanOrEqual(20);
    });

    it('문장이 없으면 일반 자르기를 사용한다', () => {
      const text = 'No sentences here just words';
      const result = truncateToTokenLimitBySentences(text, 10);
      
      expect(result.length).toBeLessThanOrEqual(text.length);
    });

    it('빈 텍스트를 처리한다', () => {
      const result = truncateToTokenLimitBySentences('', 100);
      expect(result).toBe('');
    });
  });

  describe('getTokenUsageInfo', () => {
    it('토큰 사용량 정보를 반환한다', () => {
      const text = 'Test text';
      const info = getTokenUsageInfo(text, 100);
      
      expect(info.estimatedTokens).toBeGreaterThan(0);
      expect(info.maxTokens).toBe(100);
      expect(info.isExceeded).toBe(false);
      expect(info.remainingTokens).toBeGreaterThan(0);
      expect(info.usagePercentage).toBeGreaterThan(0);
    });

    it('제한을 초과하는 경우 올바른 정보를 반환한다', () => {
      const text = 'a'.repeat(1000);
      const info = getTokenUsageInfo(text, 100);
      
      expect(info.isExceeded).toBe(true);
      expect(info.remainingTokens).toBe(0);
      expect(info.usagePercentage).toBeGreaterThan(100);
    });

    it('기본 제한값 8000을 사용한다', () => {
      const text = 'Test';
      const info = getTokenUsageInfo(text);
      
      expect(info.maxTokens).toBe(8000);
    });
  });
});
