// lib/ai/types.ts
// Gemini API 응답 및 AI 관련 타입 정의
// API 응답 구조와 데이터 모델을 정의합니다
// 관련 파일: lib/ai/gemini.ts, app/api/ai/summarize/route.ts, app/api/ai/tags/route.ts

/**
 * Gemini API 사용량 메타데이터
 */
export interface UsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

/**
 * Gemini API 후보 응답
 */
export interface Candidate {
  content: {
    parts: Array<{
      text: string;
    }>;
  };
  finishReason?: 'STOP' | 'MAX_TOKENS' | 'SAFETY' | 'RECITATION' | 'OTHER';
  safetyRatings?: Array<{
    category: string;
    probability: string;
  }>;
}

/**
 * Gemini API 응답
 */
export interface GeminiResponse {
  candidates?: Candidate[];
  usageMetadata?: UsageMetadata;
  text: string;
  usage: UsageMetadata;
  finishReason?: string;
}

/**
 * 요약 API 요청
 */
export interface SummarizeRequest {
  content: string;
  maxLength?: number;
}

/**
 * 요약 API 응답
 */
export interface SummarizeResponse {
  summary: string;
  usage: UsageMetadata;
  finishReason?: string;
}

/**
 * 태그 API 요청
 */
export interface TagsRequest {
  content: string;
  maxTags?: number;
}

/**
 * 태그 API 응답
 */
export interface TagsResponse {
  tags: string[];
  usage: UsageMetadata;
  finishReason?: string;
}

/**
 * AI 처리 상태
 */
export enum AIProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * AI 처리 결과
 */
export interface AIProcessingResult {
  status: AIProcessingStatus;
  summary?: string;
  tags?: string[];
  error?: string;
  usage?: UsageMetadata;
  processedAt?: Date;
}

/**
 * 토큰 사용량 정보
 */
export interface TokenUsageInfo {
  estimatedTokens: number;
  maxTokens: number;
  isExceeded: boolean;
  remainingTokens: number;
  usagePercentage: number;
}

/**
 * 재시도 설정
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

/**
 * 타임아웃 설정
 */
export interface TimeoutConfig {
  timeoutMs: number;
  timeoutMessage: string;
}
