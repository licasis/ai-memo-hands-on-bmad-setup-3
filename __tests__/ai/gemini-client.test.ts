// __tests__/ai/gemini-client.test.ts
// Gemini API 클라이언트 단위 테스트
// API 클라이언트 초기화 및 기본 기능을 테스트합니다
// 관련 파일: lib/ai/gemini.ts, lib/ai/config.ts

// 모든 모듈을 모킹
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'Generated text',
        usageMetadata: { totalTokenCount: 10 },
        candidates: [{ finishReason: 'STOP' }],
      }),
      generateContentStream: jest.fn(),
    },
  })),
}));

jest.mock('@/lib/ai/config', () => ({
  getGeminiConfig: jest.fn(() => ({
    apiKey: 'test-api-key',
    model: 'gemini-2.0-flash',
    maxTokens: 8000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
  })),
  validateServerSideAccess: jest.fn(),
}));

import { createGeminiClient, generateText, getDefaultGenerationConfig } from '@/lib/ai/gemini';

describe('Gemini API Client', () => {
  describe('createGeminiClient', () => {
    it('클라이언트를 성공적으로 생성한다', () => {
      const client = createGeminiClient();
      expect(client).toBeDefined();
    });
  });

  describe('getDefaultGenerationConfig', () => {
    it('기본 설정을 반환한다', () => {
      const config = getDefaultGenerationConfig();
      
      expect(config).toEqual({
        maxOutputTokens: 8000,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      });
    });
  });

  describe('generateText', () => {
    it('텍스트 생성을 성공한다', async () => {
      const result = await generateText('Test prompt');
      
      expect(result).toEqual({
        text: 'Generated text',
        usage: { totalTokenCount: 10 },
        finishReason: 'STOP',
      });
    });

    it('옵션을 전달하면 설정에 적용한다', async () => {
      const { GoogleGenAI } = require('@google/genai');
      const mockClient = {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: 'Generated text',
            usageMetadata: { totalTokenCount: 5 },
            candidates: [{ finishReason: 'STOP' }],
          }),
        },
      };
      GoogleGenAI.mockImplementation(() => mockClient);

      await generateText('Test prompt', {
        maxTokens: 100,
        temperature: 0.5,
      });

      expect(mockClient.models.generateContent).toHaveBeenCalledWith({
        model: 'gemini-2.0-flash',
        contents: 'Test prompt',
        config: {
          maxOutputTokens: 100,
          temperature: 0.5,
          topP: 0.9,
          topK: 40,
        },
      });
    });
  });
});
