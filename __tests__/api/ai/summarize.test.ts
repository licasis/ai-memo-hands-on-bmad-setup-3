// __tests__/api/ai/summarize.test.ts
// 요약 API 엔드포인트 통합 테스트
// API 요청/응답을 테스트합니다
// 관련 파일: app/api/ai/summarize/route.ts

import { POST } from '@/app/api/ai/summarize/route';

// NextRequest 모킹
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    method: init?.method || 'GET',
    json: jest.fn().mockResolvedValue({}),
    headers: new Map(),
  })),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));

// AI 모듈 모킹
jest.mock('@/lib/ai/gemini', () => ({
  generateText: jest.fn(),
}));

jest.mock('@/lib/ai/retry-utils', () => ({
  callGeminiWithRetry: jest.fn((fn) => fn()),
}));

jest.mock('@/lib/ai/timeout-utils', () => ({
  callGeminiWithTimeout: jest.fn((fn) => fn()),
}));

jest.mock('@/lib/ai/response-validator', () => ({
  validateSummarizeResponse: jest.fn((response) => response),
}));

jest.mock('@/lib/ai/fallback-handler', () => ({
  createFallbackSummary: jest.fn((content) => `Fallback: ${content.substring(0, 50)}...`),
}));

jest.mock('@/lib/ai/error-handler', () => ({
  analyzeError: jest.fn((error) => ({
    type: 'UNKNOWN_ERROR',
    message: 'Test error',
    retryable: true,
  })),
  logError: jest.fn(),
  getUserFriendlyMessage: jest.fn(() => 'Test error message'),
}));

jest.mock('@/lib/ai/token-utils', () => ({
  estimateTokens: jest.fn((text) => Math.ceil(text.length / 4)),
}));

const { generateText } = require('@/lib/ai/gemini');
const { validateSummarizeResponse } = require('@/lib/ai/response-validator');
const { createFallbackSummary } = require('@/lib/ai/fallback-handler');

describe('/api/ai/summarize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('유효한 요청에 대해 요약을 반환한다', async () => {
      const mockResponse = {
        text: 'This is a summary',
        usage: { totalTokenCount: 10 },
        finishReason: 'STOP',
      };

      // 모든 모킹 함수를 리셋하고 설정
      generateText.mockClear();
      validateSummarizeResponse.mockClear();
      
      generateText.mockResolvedValue(mockResponse);
      validateSummarizeResponse.mockReturnValue(mockResponse);

      const { NextRequest } = require('next/server');
      const request = new NextRequest('http://localhost/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({
          content: 'This is a test content for summarization.',
          maxLength: 100,
        }),
      });
      
      // json 메서드 모킹
      request.json = jest.fn().mockResolvedValue({
        content: 'This is a test content for summarization.',
        maxLength: 100,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toBe('This is a summary');
      expect(data.usage).toEqual({ totalTokenCount: 10 });
      expect(data.finishReason).toBe('STOP');
    });

    it('content가 없으면 400 에러를 반환한다', async () => {
      const { NextRequest } = require('next/server');
      const request = new NextRequest('http://localhost/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      
      request.json = jest.fn().mockResolvedValue({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Content is required and must be a string');
    });

    it('빈 content면 400 에러를 반환한다', async () => {
      const { NextRequest } = require('next/server');
      const request = new NextRequest('http://localhost/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ content: '' }),
      });
      
      request.json = jest.fn().mockResolvedValue({ content: '' });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Content is required and must be a string');
    });

    it('토큰 제한을 초과하면 400 에러를 반환한다', async () => {
      const longContent = 'a'.repeat(40000); // 10k 토큰 정도
      
      const { NextRequest } = require('next/server');
      const request = new NextRequest('http://localhost/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ content: longContent }),
      });
      
      request.json = jest.fn().mockResolvedValue({ content: longContent });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Content too long');
    });

    it('API 호출 실패 시 폴백 요약을 반환한다', async () => {
      generateText.mockRejectedValue(new Error('API Error'));
      createFallbackSummary.mockReturnValue('Fallback summary');

      const { NextRequest } = require('next/server');
      const request = new NextRequest('http://localhost/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test content',
          maxLength: 100,
        }),
      });
      
      request.json = jest.fn().mockResolvedValue({
        content: 'Test content',
        maxLength: 100,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.summary).toBe('Fallback summary');
      expect(data.finishReason).toBe('FALLBACK');
      expect(data.warning).toBeDefined();
    });

    it('기본 maxLength를 사용한다', async () => {
      const mockResponse = {
        text: 'Summary',
        usage: {},
        finishReason: 'STOP',
      };

      generateText.mockResolvedValue(mockResponse);
      validateSummarizeResponse.mockReturnValue(mockResponse);

      const { NextRequest } = require('next/server');
      const request = new NextRequest('http://localhost/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test content' }),
      });
      
      request.json = jest.fn().mockResolvedValue({ content: 'Test content' });

      await POST(request);

      expect(generateText).toHaveBeenCalledWith(
        expect.stringContaining('200자 이내로 요약해주세요'),
        expect.any(Object)
      );
    });
  });
});
