// lib/ai/retry-utils.ts
// API 호출 재시도 및 에러 핸들링 유틸리티
// 지수 백오프를 사용한 재시도 로직을 구현합니다
// 관련 파일: lib/ai/gemini.ts, app/api/ai/summarize/route.ts, app/api/ai/tags/route.ts

/**
 * 재시도 설정 옵션
 */
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

/**
 * 기본 재시도 설정
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelay: 1000, // 1초
  maxDelay: 10000, // 10초
  backoffMultiplier: 2,
  retryableErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'RATE_LIMIT_EXCEEDED',
    'SERVICE_UNAVAILABLE',
    'INTERNAL_ERROR',
  ],
};

/**
 * 지수 백오프를 사용한 재시도 로직
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // 마지막 시도이거나 재시도 불가능한 에러인 경우
      if (attempt === config.maxAttempts || !isRetryableError(lastError, config.retryableErrors)) {
        throw lastError;
      }
      
      // 지수 백오프로 대기 시간 계산
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
        config.maxDelay
      );
      
      console.warn(`API 호출 실패 (시도 ${attempt}/${config.maxAttempts}):`, lastError.message);
      console.log(`${delay}ms 후 재시도...`);
      
      await sleep(delay);
    }
  }
  
  throw lastError || new Error('Retry failed');
}

/**
 * 에러가 재시도 가능한지 확인합니다.
 */
function isRetryableError(error: Error, retryableErrors: string[]): boolean {
  const errorMessage = error.message.toLowerCase();
  const errorCode = (error as any).code;
  
  return retryableErrors.some(retryableError => 
    errorMessage.includes(retryableError.toLowerCase()) ||
    errorCode === retryableError
  );
}

/**
 * 지정된 시간만큼 대기합니다.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * API 호출을 위한 래퍼 함수
 */
export async function callGeminiWithRetry<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  return withRetry(operation, {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    ...options,
  });
}
