// lib/ai/gemini.ts
// Gemini API 클라이언트 및 유틸리티 함수
// Google Gemini API를 사용한 텍스트 생성 및 처리 기능
// 관련 파일: lib/ai/config.ts, app/api/ai/summarize/route.ts, app/api/ai/tags/route.ts

import { GoogleGenAI } from '@google/genai';
import { getGeminiConfig, validateServerSideAccess } from './config';

/**
 * Gemini API 클라이언트를 초기화합니다.
 * 서버 사이드에서만 실행되어야 합니다.
 */
export function createGeminiClient() {
  validateServerSideAccess();
  
  const config = getGeminiConfig();
  
  return new GoogleGenAI({
    apiKey: config.apiKey,
  });
}

/**
 * 텍스트 생성을 위한 기본 설정을 반환합니다.
 */
export function getDefaultGenerationConfig() {
  const config = getGeminiConfig();
  
  return {
    maxOutputTokens: config.maxTokens,
    temperature: config.temperature,
    topP: config.topP,
    topK: config.topK,
  };
}

/**
 * 텍스트를 생성합니다.
 */
export async function generateText(prompt: string, options?: {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}) {
  const client = createGeminiClient();
  const config = getDefaultGenerationConfig();
  
  const response = await client.models.generateContent({
    model: options?.model || 'gemini-2.0-flash',
    contents: prompt,
    config: {
      maxOutputTokens: options?.maxTokens || config.maxOutputTokens,
      temperature: options?.temperature || config.temperature,
      topP: options?.topP || config.topP,
      topK: options?.topK || config.topK,
    },
  });
  
  return {
    text: response.text,
    usage: response.usageMetadata,
    finishReason: response.candidates?.[0]?.finishReason,
  };
}

/**
 * 스트리밍 텍스트 생성을 위한 함수입니다.
 */
export async function* generateTextStream(prompt: string, options?: {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}) {
  const client = createGeminiClient();
  const config = getDefaultGenerationConfig();
  
  const response = await client.models.generateContentStream({
    model: options?.model || 'gemini-2.0-flash',
    contents: prompt,
    config: {
      maxOutputTokens: options?.maxTokens || config.maxOutputTokens,
      temperature: options?.temperature || config.temperature,
      topP: options?.topP || config.topP,
      topK: options?.topK || config.topK,
    },
  });
  
  for await (const chunk of response) {
    yield {
      text: chunk.text,
      usage: chunk.usageMetadata,
      finishReason: chunk.candidates?.[0]?.finishReason,
    };
  }
}

/**
 * 노트 내용에서 태그를 생성합니다.
 */
export async function generateTags(content: string, options?: {
  maxTags?: number;
  language?: 'ko' | 'en' | 'both';
  temperature?: number;
}) {
  const { maxTags = 6, language = 'both', temperature = 0.7 } = options || {};
  
  // 언어별 프롬프트 설정
  const languageInstruction = language === 'ko' 
    ? '한국어로만 태그를 생성해주세요.'
    : language === 'en'
    ? '영어로만 태그를 생성해주세요.'
    : '한국어와 영어를 섞어서 태그를 생성해주세요.';

  const prompt = `
다음 노트 내용을 분석하여 관련성 높은 태그를 생성해주세요.

노트 내용:
${content}

요구사항:
- 정확히 ${maxTags}개의 태그를 생성해주세요
- ${languageInstruction}
- 각 태그는 1-3단어로 간결하게 작성해주세요
- 태그는 콤마(,)로 구분해주세요
- 불필요한 기호나 특수문자는 사용하지 마세요
- 태그는 노트의 핵심 주제와 키워드를 반영해야 합니다

태그 목록:
`;

  try {
    const result = await generateText(prompt, {
      temperature,
      maxTokens: 200, // 태그 생성에는 적은 토큰으로 충분
    });

    // 응답에서 태그 추출 및 정리
    const tagsText = result.text.trim();
    const tags = tagsText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, maxTags); // 최대 개수 제한

    return tags;
  } catch (error) {
    console.error('태그 생성 오류:', error);
    throw new Error('태그 생성에 실패했습니다.');
  }
}