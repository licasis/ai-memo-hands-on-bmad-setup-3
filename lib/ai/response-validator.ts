// lib/ai/response-validator.ts
// Gemini API 응답 파싱 및 검증
// API 응답의 유효성을 검사하고 파싱합니다
// 관련 파일: lib/ai/types.ts, lib/ai/gemini.ts

import { GeminiResponse, SummarizeResponse, TagsResponse, GeminiCandidate } from './types';

/**
 * Gemini API 응답을 검증합니다.
 */
export function validateGeminiResponse(response: unknown): GeminiResponse {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response: response must be an object');
  }

  const responseObj = response as Record<string, unknown>;

  if (!responseObj.text || typeof responseObj.text !== 'string') {
    throw new Error('Invalid response: text field is required and must be a string');
  }

  if (responseObj.usage && typeof responseObj.usage !== 'object') {
    throw new Error('Invalid response: usage must be an object');
  }

  return {
    text: responseObj.text.trim(),
    usage: (responseObj.usage as Record<string, unknown>) || {},
    finishReason: responseObj.finishReason as string | undefined,
    candidates: (responseObj.candidates as GeminiCandidate[]) || [],
  };
}

/**
 * 요약 응답을 검증하고 파싱합니다.
 */
export function validateSummarizeResponse(response: unknown): SummarizeResponse {
  const validatedResponse = validateGeminiResponse(response);
  
  if (!validatedResponse.text || validatedResponse.text.length === 0) {
    throw new Error('Invalid summary: summary text is empty');
  }
  
  return {
    summary: validatedResponse.text,
    usage: validatedResponse.usage,
    finishReason: validatedResponse.finishReason,
  };
}

/**
 * 태그 응답을 검증하고 파싱합니다.
 */
export function validateTagsResponse(response: unknown): TagsResponse {
  const validatedResponse = validateGeminiResponse(response);
  
  // 태그 파싱 및 검증
  const tags = parseTags(validatedResponse.text);
  
  if (tags.length === 0) {
    throw new Error('Invalid tags: no valid tags found in response');
  }
  
  return {
    tags,
    usage: validatedResponse.usage,
    finishReason: validatedResponse.finishReason,
  };
}

/**
 * 텍스트에서 태그를 파싱합니다.
 */
function parseTags(text: string): string[] {
  // 쉼표로 구분된 태그 파싱
  const tags = text
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => {
      // 빈 문자열 제거
      if (!tag || tag.length === 0) return false;
      
      // 너무 긴 태그 제거 (50자 이상)
      if (tag.length > 50) return false;
      
      // 특수 문자만 있는 태그 제거
      if (!/[a-zA-Z가-힣0-9]/.test(tag)) return false;
      
      return true;
    });
  
  return tags;
}

/**
 * 응답의 품질을 검증합니다.
 */
export function validateResponseQuality(response: GeminiResponse, type: 'summary' | 'tags'): boolean {
  if (type === 'summary') {
    return validateSummaryQuality(response.text);
  } else if (type === 'tags') {
    return validateTagsQuality(response.text);
  }
  
  return false;
}

/**
 * 요약 품질을 검증합니다.
 */
function validateSummaryQuality(text: string): boolean {
  // 최소 길이 확인
  if (text.length < 10) return false;
  
  // 최대 길이 확인 (너무 긴 요약은 품질이 떨어질 수 있음)
  if (text.length > 1000) return false;
  
  // 의미 있는 내용이 있는지 확인 (단순 반복이나 무의미한 텍스트 제외)
  const words = text.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 3) return false;
  
  return true;
}

/**
 * 태그 품질을 검증합니다.
 */
function validateTagsQuality(text: string): boolean {
  const tags = parseTags(text);
  
  // 최소 태그 개수 확인
  if (tags.length === 0) return false;
  
  // 각 태그의 품질 확인
  for (const tag of tags) {
    if (tag.length < 2 || tag.length > 30) return false;
    if (!/[a-zA-Z가-힣0-9]/.test(tag)) return false;
  }
  
  return true;
}

/**
 * 응답에서 사용량 정보를 추출합니다.
 */
export function extractUsageInfo(response: GeminiResponse) {
  const usage = response.usage || {};
  
  return {
    promptTokens: usage.promptTokenCount || 0,
    responseTokens: usage.candidatesTokenCount || 0,
    totalTokens: usage.totalTokenCount || 0,
  };
}
