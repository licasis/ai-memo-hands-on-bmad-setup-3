// lib/ai/text-processor.ts
// 텍스트 처리 및 요약 로직
// 긴 텍스트를 처리하고 요약을 생성합니다
// 관련 파일: lib/ai/token-utils.ts, lib/ai/gemini.ts

import { estimateTokens, truncateToTokenLimitBySentences, getTokenUsageInfo } from './token-utils';
import { generateText } from './gemini';

/**
 * 긴 텍스트를 청크로 나누어 처리합니다.
 */
export function splitTextIntoChunks(text: string, maxChunkTokens: number = 6000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]\s+/);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const testChunk = currentChunk + (currentChunk ? '. ' : '') + sentence;
    
    if (estimateTokens(testChunk) <= maxChunkTokens) {
      currentChunk = testChunk;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        // 문장이 너무 긴 경우 강제로 자르기
        chunks.push(truncateToTokenLimitBySentences(sentence, maxChunkTokens));
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * 여러 청크의 요약을 결합합니다.
 */
export async function summarizeLongText(text: string, maxLength: number = 200): Promise<string> {
  const tokenInfo = getTokenUsageInfo(text);
  
  // 토큰 제한 내에 있으면 직접 요약
  if (!tokenInfo.isExceeded) {
    return await generateSummary(text, maxLength);
  }
  
  // 긴 텍스트는 청크로 나누어 처리
  const chunks = splitTextIntoChunks(text);
  const chunkSummaries: string[] = [];
  
  for (const chunk of chunks) {
    const summary = await generateSummary(chunk, Math.ceil(maxLength / chunks.length));
    chunkSummaries.push(summary);
  }
  
  // 청크 요약들을 결합하여 최종 요약 생성
  const combinedSummaries = chunkSummaries.join(' ');
  return await generateSummary(combinedSummaries, maxLength);
}

/**
 * 단일 텍스트의 요약을 생성합니다.
 */
async function generateSummary(text: string, maxLength: number): Promise<string> {
  const prompt = `다음 텍스트를 ${maxLength}자 이내로 요약해주세요. 핵심 내용을 간결하게 정리해주세요:

${text}`;
  
  const result = await generateText(prompt, {
    maxTokens: Math.min(500, Math.ceil(maxLength / 4)),
    temperature: 0.3,
  });
  
  return result.text || '';
}

/**
 * 텍스트에서 태그를 추출합니다.
 */
export async function extractTagsFromText(text: string, maxTags: number = 5): Promise<string[]> {
  const tokenInfo = getTokenUsageInfo(text);
  
  // 토큰 제한 내에 있으면 직접 처리
  if (!tokenInfo.isExceeded) {
    return await generateTags(text, maxTags);
  }
  
  // 긴 텍스트는 청크로 나누어 처리
  const chunks = splitTextIntoChunks(text);
  const allTags = new Set<string>();
  
  for (const chunk of chunks) {
    const tags = await generateTags(chunk, Math.ceil(maxTags / chunks.length));
    tags.forEach(tag => allTags.add(tag));
  }
  
  return Array.from(allTags).slice(0, maxTags);
}

/**
 * 단일 텍스트에서 태그를 생성합니다.
 */
async function generateTags(text: string, maxTags: number): Promise<string[]> {
  const prompt = `다음 텍스트를 분석하여 ${maxTags}개 이하의 관련 태그를 생성해주세요. 태그는 쉼표로 구분하고, 한국어로 작성해주세요:

${text}

태그:`;
  
  const result = await generateText(prompt, {
    maxTokens: 100,
    temperature: 0.5,
  });
  
  return (result.text || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, maxTags);
}
