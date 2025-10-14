// __tests__/ai/error-handler.test.ts
// AI 에러 핸들링 테스트
// 에러 분류 및 처리 로직을 테스트합니다
// 관련 파일: lib/ai/error-handler.ts

import { analyzeError, getUserFriendlyMessage, AIErrorType, AIError } from '@/lib/ai/error-handler';

describe('AI Error Handler', () => {
  describe('analyzeError', () => {
    it('인증 에러를 올바르게 분류한다', () => {
      const error = new Error('API key is invalid');
      const result = analyzeError(error);
      
      expect(result.type).toBe(AIErrorType.AUTHENTICATION_ERROR);
      expect(result.retryable).toBe(false);
    });

    it('속도 제한 에러를 올바르게 분류한다', () => {
      const error = new Error('rate limit exceeded');
      const result = analyzeError(error);
      
      expect(result.type).toBe(AIErrorType.RATE_LIMIT_ERROR);
      expect(result.retryable).toBe(true);
    });

    it('할당량 초과 에러를 올바르게 분류한다', () => {
      const error = new Error('quota exceeded');
      const result = analyzeError(error);
      
      expect(result.type).toBe(AIErrorType.QUOTA_EXCEEDED_ERROR);
      expect(result.retryable).toBe(false);
    });

    it('토큰 제한 에러를 올바르게 분류한다', () => {
      const error = new Error('token limit exceeded');
      const result = analyzeError(error);
      
      expect(result.type).toBe(AIErrorType.TOKEN_LIMIT_ERROR);
      expect(result.retryable).toBe(false);
    });

    it('네트워크 에러를 올바르게 분류한다', () => {
      const error = new Error('Network connection failed');
      (error as any).code = 'ECONNRESET';
      const result = analyzeError(error);
      
      expect(result.type).toBe(AIErrorType.NETWORK_ERROR);
      expect(result.retryable).toBe(true);
    });

    it('타임아웃 에러를 올바르게 분류한다', () => {
      const error = new Error('Request timeout');
      (error as any).code = 'TIMEOUT';
      const result = analyzeError(error);
      
      expect(result.type).toBe(AIErrorType.TIMEOUT_ERROR);
      expect(result.retryable).toBe(true);
    });

    it('알 수 없는 에러를 기본값으로 분류한다', () => {
      const error = new Error('Unknown error');
      const result = analyzeError(error);
      
      expect(result.type).toBe(AIErrorType.UNKNOWN_ERROR);
      expect(result.retryable).toBe(true);
    });

    it('AIError 인스턴스를 그대로 반환한다', () => {
      const originalError = new AIError(
        AIErrorType.NETWORK_ERROR,
        'Test error',
        undefined,
        true
      );
      
      const result = analyzeError(originalError);
      
      expect(result).toBe(originalError);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('인증 에러에 대한 사용자 친화적 메시지를 반환한다', () => {
      const error = new AIError(AIErrorType.AUTHENTICATION_ERROR, 'API key invalid');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toBe('API 설정에 문제가 있습니다. 관리자에게 문의해주세요.');
    });

    it('속도 제한 에러에 대한 메시지를 반환한다', () => {
      const error = new AIError(AIErrorType.RATE_LIMIT_ERROR, 'Rate limit exceeded');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
    });

    it('할당량 초과 에러에 대한 메시지를 반환한다', () => {
      const error = new AIError(AIErrorType.QUOTA_EXCEEDED_ERROR, 'Quota exceeded');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toBe('API 사용 한도를 초과했습니다. 관리자에게 문의해주세요.');
    });

    it('토큰 제한 에러에 대한 메시지를 반환한다', () => {
      const error = new AIError(AIErrorType.TOKEN_LIMIT_ERROR, 'Token limit exceeded');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toBe('텍스트가 너무 깁니다. 내용을 줄여주세요.');
    });

    it('네트워크 에러에 대한 메시지를 반환한다', () => {
      const error = new AIError(AIErrorType.NETWORK_ERROR, 'Network error');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toBe('네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
    });

    it('타임아웃 에러에 대한 메시지를 반환한다', () => {
      const error = new AIError(AIErrorType.TIMEOUT_ERROR, 'Timeout');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toBe('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    });

    it('알 수 없는 에러에 대한 기본 메시지를 반환한다', () => {
      const error = new AIError(AIErrorType.UNKNOWN_ERROR, 'Unknown error');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toBe('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    });
  });
});
