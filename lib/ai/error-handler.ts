// lib/ai/error-handler.ts
// AI API 에러 핸들링 및 로깅
// 에러를 분류하고 적절한 응답을 생성합니다
// 관련 파일: lib/ai/gemini.ts, app/api/ai/summarize/route.ts, app/api/ai/tags/route.ts

/**
 * AI API 에러 타입
 */
export enum AIErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  QUOTA_EXCEEDED_ERROR = 'QUOTA_EXCEEDED_ERROR',
  INVALID_REQUEST_ERROR = 'INVALID_REQUEST_ERROR',
  TOKEN_LIMIT_ERROR = 'TOKEN_LIMIT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * AI API 에러 클래스
 */
export class AIError extends Error {
  constructor(
    public type: AIErrorType,
    message: string,
    public originalError?: Error,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * 에러를 분석하고 분류합니다.
 */
export function analyzeError(error: unknown): AIError {
  if (error instanceof AIError) {
    return error;
  }
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = typeof error === 'object' && error !== null && 'code' in error ? (error as { code: string }).code : undefined;
  
  // 인증 에러
  if (errorMessage.includes('API key') || errorMessage.includes('authentication') || errorCode === 'UNAUTHENTICATED') {
    return new AIError(
      AIErrorType.AUTHENTICATION_ERROR,
      'API 키가 유효하지 않습니다. 환경 변수를 확인해주세요.',
      error instanceof Error ? error : undefined,
      false
    );
  }
  
  // 속도 제한 에러
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests') || errorCode === 'RATE_LIMIT_EXCEEDED') {
    return new AIError(
      AIErrorType.RATE_LIMIT_ERROR,
      'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
      error instanceof Error ? error : undefined,
      true
    );
  }
  
  // 할당량 초과 에러
  if (errorMessage.includes('quota') || errorMessage.includes('billing') || errorCode === 'QUOTA_EXCEEDED') {
    return new AIError(
      AIErrorType.QUOTA_EXCEEDED_ERROR,
      'API 할당량을 초과했습니다. 결제 정보를 확인해주세요.',
      error instanceof Error ? error : undefined,
      false
    );
  }
  
  // 잘못된 요청 에러
  if (errorMessage.includes('invalid') || errorMessage.includes('bad request') || errorCode === 'INVALID_ARGUMENT') {
    return new AIError(
      AIErrorType.INVALID_REQUEST_ERROR,
      '잘못된 요청입니다. 입력 데이터를 확인해주세요.',
      error instanceof Error ? error : undefined,
      false
    );
  }
  
  // 토큰 제한 에러
  if (errorMessage.includes('token') || errorMessage.includes('length') || errorCode === 'INVALID_ARGUMENT') {
    return new AIError(
      AIErrorType.TOKEN_LIMIT_ERROR,
      '텍스트가 너무 깁니다. 내용을 줄여주세요.',
      error instanceof Error ? error : undefined,
      false
    );
  }
  
  // 네트워크 에러
  if (errorMessage.includes('network') || errorMessage.includes('connection') || 
      errorCode === 'ECONNRESET' || errorCode === 'ETIMEDOUT' || errorCode === 'ENOTFOUND') {
    return new AIError(
      AIErrorType.NETWORK_ERROR,
      '네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
      error instanceof Error ? error : undefined,
      true
    );
  }
  
  // 타임아웃 에러
  if (errorMessage.includes('timeout') || errorCode === 'TIMEOUT') {
    return new AIError(
      AIErrorType.TIMEOUT_ERROR,
      '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
      error instanceof Error ? error : undefined,
      true
    );
  }
  
  // 알 수 없는 에러
  return new AIError(
    AIErrorType.UNKNOWN_ERROR,
    '예상치 못한 오류가 발생했습니다.',
    error instanceof Error ? error : undefined,
    true
  );
}

/**
 * 에러를 로깅합니다.
 */
export function logError(error: AIError, context?: Record<string, unknown>): void {
  const logData = {
    type: error.type,
    message: error.message,
    retryable: error.retryable,
    context,
    timestamp: new Date().toISOString(),
    originalError: error.originalError?.message,
  };
  
  if (error.type === AIErrorType.AUTHENTICATION_ERROR || error.type === AIErrorType.QUOTA_EXCEEDED_ERROR) {
    console.error('AI API Critical Error:', logData);
  } else {
    console.warn('AI API Error:', logData);
  }
}

/**
 * 사용자에게 표시할 에러 메시지를 생성합니다.
 */
export function getUserFriendlyMessage(error: AIError): string {
  switch (error.type) {
    case AIErrorType.AUTHENTICATION_ERROR:
      return 'API 설정에 문제가 있습니다. 관리자에게 문의해주세요.';
    case AIErrorType.RATE_LIMIT_ERROR:
      return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    case AIErrorType.QUOTA_EXCEEDED_ERROR:
      return 'API 사용 한도를 초과했습니다. 관리자에게 문의해주세요.';
    case AIErrorType.INVALID_REQUEST_ERROR:
      return '잘못된 요청입니다. 입력 내용을 확인해주세요.';
    case AIErrorType.TOKEN_LIMIT_ERROR:
      return '텍스트가 너무 깁니다. 내용을 줄여주세요.';
    case AIErrorType.NETWORK_ERROR:
      return '네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
    case AIErrorType.TIMEOUT_ERROR:
      return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
}
