// lib/ai/fallback-handler.ts
// 잘못된 응답 처리 및 폴백 로직
// AI API 응답이 유효하지 않을 때 대체 방안을 제공합니다
// 관련 파일: lib/ai/response-validator.ts, lib/ai/types.ts

import { AIProcessingResult, AIProcessingStatus } from './types';

/**
 * 요약 생성 실패 시 폴백 요약을 생성합니다.
 */
export function createFallbackSummary(content: string, maxLength: number = 200): string {
  // 텍스트를 문장으로 분할
  const sentences = content.split(/[.!?]\s+/).filter(sentence => sentence.trim().length > 0);
  
  if (sentences.length === 0) {
    return '요약을 생성할 수 없습니다.';
  }
  
  // 첫 번째 문장을 기본 요약으로 사용
  let summary = sentences[0];
  
  // 길이 제한에 맞게 조정
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength - 3) + '...';
  }
  
  // 추가 문장을 길이 제한 내에서 추가
  let currentLength = summary.length;
  for (let i = 1; i < sentences.length && currentLength < maxLength; i++) {
    const nextSentence = sentences[i];
    const testLength = currentLength + nextSentence.length + 2; // +2 for '. '
    
    if (testLength <= maxLength) {
      summary += '. ' + nextSentence;
      currentLength = testLength;
    } else {
      // 남은 공간에 맞게 자르기
      const remainingSpace = maxLength - currentLength - 3; // -3 for '...'
      if (remainingSpace > 10) {
        summary += '. ' + nextSentence.substring(0, remainingSpace) + '...';
      }
      break;
    }
  }
  
  return summary;
}

/**
 * 태그 생성 실패 시 폴백 태그를 생성합니다.
 */
export function createFallbackTags(content: string, maxTags: number = 5): string[] {
  const tags: string[] = [];
  
  // 키워드 추출을 위한 간단한 로직
  const words = content
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  // 단어 빈도 계산
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // 빈도순으로 정렬하여 상위 키워드 선택
  const sortedWords = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word)
    .slice(0, maxTags);
  
  // 기본 태그 추가
  if (content.includes('회의') || content.includes('미팅')) {
    tags.push('회의');
  }
  if (content.includes('프로젝트') || content.includes('작업')) {
    tags.push('프로젝트');
  }
  if (content.includes('아이디어') || content.includes('생각')) {
    tags.push('아이디어');
  }
  if (content.includes('학습') || content.includes('공부')) {
    tags.push('학습');
  }
  if (content.includes('일정') || content.includes('계획')) {
    tags.push('일정');
  }
  
  // 키워드 태그 추가
  sortedWords.forEach(word => {
    if (tags.length < maxTags && !tags.includes(word)) {
      tags.push(word);
    }
  });
  
  // 태그가 없으면 기본 태그 추가
  if (tags.length === 0) {
    tags.push('노트');
  }
  
  return tags.slice(0, maxTags);
}

/**
 * AI 처리 결과에 폴백을 적용합니다.
 */
export function applyFallbackToResult(
  result: AIProcessingResult,
  content: string,
  maxSummaryLength: number = 200,
  maxTags: number = 5
): AIProcessingResult {
  if (result.status === AIProcessingStatus.FAILED) {
    return {
      ...result,
      status: AIProcessingStatus.COMPLETED,
      summary: createFallbackSummary(content, maxSummaryLength),
      tags: createFallbackTags(content, maxTags),
      error: undefined,
      processedAt: new Date(),
    };
  }
  
  // 요약이 없거나 비어있는 경우
  if (!result.summary || result.summary.trim().length === 0) {
    result.summary = createFallbackSummary(content, maxSummaryLength);
  }
  
  // 태그가 없거나 비어있는 경우
  if (!result.tags || result.tags.length === 0) {
    result.tags = createFallbackTags(content, maxTags);
  }
  
  return result;
}

/**
 * 응답 품질이 낮을 때 개선된 폴백을 제공합니다.
 */
export function improveLowQualityResponse(
  summary: string,
  tags: string[],
  content: string
): { summary: string; tags: string[] } {
  let improvedSummary = summary;
  let improvedTags = [...tags];
  
  // 요약이 너무 짧은 경우 개선
  if (summary.length < 50) {
    improvedSummary = createFallbackSummary(content, 200);
  }
  
  // 태그가 너무 적은 경우 개선
  if (tags.length < 2) {
    const fallbackTags = createFallbackTags(content, 5);
    improvedTags = [...new Set([...tags, ...fallbackTags])].slice(0, 5);
  }
  
  return {
    summary: improvedSummary,
    tags: improvedTags,
  };
}
