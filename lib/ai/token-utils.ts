// lib/ai/token-utils.ts
// 토큰 계산 및 제한 관리 유틸리티
// 텍스트를 토큰으로 변환하고 제한을 관리합니다
// 관련 파일: lib/ai/config.ts, app/api/ai/summarize/route.ts, app/api/ai/tags/route.ts

/**
 * 텍스트의 대략적인 토큰 수를 계산합니다.
 * 1 토큰 ≈ 4 문자 (영어 기준, 한국어는 조금 더 많을 수 있음)
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) return 0;
  
  // 한국어 텍스트는 토큰이 더 많이 필요할 수 있으므로 1.2배 적용
  const koreanMultiplier = /[\u3131-\u3163\uac00-\ud7a3]/.test(text) ? 1.2 : 1;
  
  return Math.ceil((text.length / 4) * koreanMultiplier);
}

/**
 * 텍스트가 토큰 제한을 초과하는지 확인합니다.
 */
export function isTokenLimitExceeded(text: string, maxTokens: number = 8000): boolean {
  return estimateTokens(text) > maxTokens;
}

/**
 * 텍스트를 토큰 제한에 맞게 자릅니다.
 */
export function truncateToTokenLimit(text: string, maxTokens: number = 8000): string {
  if (!isTokenLimitExceeded(text, maxTokens)) {
    return text;
  }
  
  // 이진 탐색으로 적절한 길이 찾기
  let left = 0;
  let right = text.length;
  let bestLength = 0;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const substring = text.substring(0, mid);
    const tokens = estimateTokens(substring);
    
    if (tokens <= maxTokens) {
      bestLength = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return text.substring(0, bestLength);
}

/**
 * 텍스트를 문장 단위로 자르면서 토큰 제한을 준수합니다.
 */
export function truncateToTokenLimitBySentences(text: string, maxTokens: number = 8000): string {
  if (!isTokenLimitExceeded(text, maxTokens)) {
    return text;
  }
  
  const sentences = text.split(/[.!?]\s+/);
  let result = '';
  
  for (const sentence of sentences) {
    const testText = result + (result ? '. ' : '') + sentence;
    
    if (estimateTokens(testText) <= maxTokens) {
      result = testText;
    } else {
      break;
    }
  }
  
  return result || truncateToTokenLimit(text, maxTokens);
}

/**
 * 토큰 사용량 정보를 반환합니다.
 */
export function getTokenUsageInfo(text: string, maxTokens: number = 8000) {
  const estimatedTokens = estimateTokens(text);
  const isExceeded = isTokenLimitExceeded(text, maxTokens);
  
  return {
    estimatedTokens,
    maxTokens,
    isExceeded,
    remainingTokens: Math.max(0, maxTokens - estimatedTokens),
    usagePercentage: Math.round((estimatedTokens / maxTokens) * 100),
  };
}
