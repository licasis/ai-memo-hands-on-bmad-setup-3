// lib/ai/timeout-utils.ts
// API 호출 타임아웃 처리 유틸리티
// 지정된 시간 내에 완료되지 않는 요청을 취소합니다
// 관련 파일: lib/ai/gemini.ts, lib/ai/retry-utils.ts

/**
 * 타임아웃 설정 옵션
 */
export interface TimeoutOptions {
  timeoutMs?: number;
  timeoutMessage?: string;
}

/**
 * 기본 타임아웃 설정
 */
const DEFAULT_TIMEOUT_OPTIONS: Required<TimeoutOptions> = {
  timeoutMs: 30000, // 30초
  timeoutMessage: 'Operation timed out',
};

/**
 * 타임아웃과 함께 비동기 작업을 실행합니다.
 */
export async function withTimeout<T>(
  operation: () => Promise<T>,
  options: TimeoutOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_TIMEOUT_OPTIONS, ...options };
  
  return Promise.race([
    operation(),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(config.timeoutMessage));
      }, config.timeoutMs);
    }),
  ]);
}

/**
 * Gemini API 호출을 위한 타임아웃 래퍼
 */
export async function callGeminiWithTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return withTimeout(operation, {
    timeoutMs,
    timeoutMessage: `Gemini API call timed out after ${timeoutMs}ms`,
  });
}

/**
 * 여러 작업을 병렬로 실행하되 전체 타임아웃을 적용합니다.
 */
export async function withParallelTimeout<T>(
  operations: (() => Promise<T>)[],
  options: TimeoutOptions = {}
): Promise<T[]> {
  const config = { ...DEFAULT_TIMEOUT_OPTIONS, ...options };
  
  const promises = operations.map(op => withTimeout(op, config));
  
  return Promise.race([
    Promise.all(promises),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Parallel operations timed out after ${config.timeoutMs}ms`));
      }, config.timeoutMs);
    }),
  ]);
}
