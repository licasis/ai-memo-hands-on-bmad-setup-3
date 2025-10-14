// lib/ai/test-connection.ts
// Gemini API 연결 테스트 함수
// API 키 유효성 및 연결 상태를 확인합니다
// 관련 파일: lib/ai/gemini.ts, lib/ai/config.ts

import { createGeminiClient, generateText } from './gemini';

/**
 * Gemini API 연결을 테스트합니다.
 */
export async function testGeminiConnection(): Promise<{
  success: boolean;
  error?: string;
  responseTime?: number;
}> {
  const startTime = Date.now();
  
  try {
    // 간단한 테스트 프롬프트로 API 연결 확인
    const result = await generateText('Hello, this is a test message. Please respond with "API connection successful."');
    
    const responseTime = Date.now() - startTime;
    
    if (result.text && result.text.includes('API connection successful')) {
      return {
        success: true,
        responseTime,
      };
    } else {
      return {
        success: false,
        error: 'Unexpected response from API',
        responseTime,
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      responseTime,
    };
  }
}

/**
 * API 키 유효성을 검증합니다.
 */
export async function validateApiKey(): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const client = createGeminiClient();
    
    // API 키가 유효한지 확인하기 위한 최소한의 요청
    await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'test',
      config: {
        maxOutputTokens: 1,
      },
    });
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'API key validation failed',
    };
  }
}
