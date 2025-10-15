// lib/ai/types.ts
// AI 관련 타입 정의
// AI 처리 상태, 설정, 응답 등의 타입을 정의하는 파일
// 관련 파일: components/notes/ai-summary-button.tsx, components/notes/ai-tag-button.tsx

export type AIProcessStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AIStatusState {
  status: AIProcessStatus;
  message: string;
  progress?: number;
  error?: string;
  timestamp?: number;
}

export interface AISummaryResponse {
  summary: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AITagResponse {
  tags: string[];
  count: number;
  language: 'ko' | 'en' | 'both';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AISettings {
  maxLength?: number;
  maxTags?: number;
  language?: 'ko' | 'en' | 'both';
  temperature?: number;
  autoApply?: boolean;
}

export interface AIError {
  code: string;
  message: string;
  details?: string;
  retryable?: boolean;
}

export const AI_STATUS_MESSAGES = {
  idle: 'AI 기능을 사용할 수 있습니다',
  loading: 'AI가 처리 중입니다...',
  success: 'AI 처리가 완료되었습니다',
  error: 'AI 처리 중 오류가 발생했습니다',
} as const;

export const AI_STATUS_COLORS = {
  idle: 'text-gray-500',
  loading: 'text-blue-500',
  success: 'text-green-500',
  error: 'text-red-500',
} as const;

export const AI_STATUS_BG_COLORS = {
  idle: 'bg-gray-50',
  loading: 'bg-blue-50',
  success: 'bg-green-50',
  error: 'bg-red-50',
} as const;