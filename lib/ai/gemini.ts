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
