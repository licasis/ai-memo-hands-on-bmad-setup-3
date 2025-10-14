// lib/ai/config.ts
// Gemini API 환경 변수 검증 및 설정
// 서버 사이드에서만 API 키에 접근하도록 보안 설정
// 관련 파일: .env.local, lib/ai/gemini.ts

/**
 * Gemini API 설정을 검증하고 반환합니다.
 * 서버 사이드에서만 실행되어야 합니다.
 */
export function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  
  if (apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY must be set to a valid API key');
  }
  
  return {
    apiKey,
    model: 'gemini-2.0-flash',
    maxTokens: 8000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
  };
}

/**
 * 환경 변수가 서버 사이드에서만 접근 가능한지 확인합니다.
 */
export function validateServerSideAccess() {
  if (typeof window !== 'undefined') {
    throw new Error('Gemini API configuration must only be accessed on the server side');
  }
}
