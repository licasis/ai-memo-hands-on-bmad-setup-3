// app/api/ai/summarize/route.ts
// 노트 요약을 위한 API 엔드포인트
// Gemini API를 사용하여 노트 내용을 요약합니다
// 관련 파일: lib/ai/gemini.ts, lib/ai/config.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/gemini';
import { getGeminiConfig } from '@/lib/ai/config';
import { callGeminiWithRetry } from '@/lib/ai/retry-utils';
import { callGeminiWithTimeout } from '@/lib/ai/timeout-utils';
import { analyzeError, logError, getUserFriendlyMessage } from '@/lib/ai/error-handler';
import { validateSummarizeResponse } from '@/lib/ai/response-validator';
import { createFallbackSummary } from '@/lib/ai/fallback-handler';
import { estimateTokens } from '@/lib/ai/token-utils';

export async function POST(request: NextRequest) {
  let content: string | undefined;
  let maxLength: number = 200;
  let temperature: number = 0.7;
  
  try {
    const requestData = await request.json();
    content = requestData.content;
    maxLength = requestData.maxLength || 200;
    temperature = requestData.temperature || 0.7;
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }
    
    // 토큰 제한 확인
    const config = getGeminiConfig();
    const estimatedTokens = estimateTokens(content);
    
    if (estimatedTokens > config.maxTokens) {
      return NextResponse.json(
        { error: `Content too long. Estimated tokens: ${estimatedTokens}, max allowed: ${config.maxTokens}` },
        { status: 400 }
      );
    }
    
    // 요약 프롬프트 생성
    const prompt = `다음 노트 내용을 ${maxLength}자 이내로 요약해주세요. 핵심 내용을 간결하게 정리해주세요:

${content}`;
    
        // 재시도 및 타임아웃과 함께 API 호출
        const result = await callGeminiWithTimeout(
          () => callGeminiWithRetry(
            () => generateText(prompt, {
              maxTokens: Math.min(500, Math.ceil(maxLength / 4)),
              temperature: temperature,
            })
          ),
          30000 // 30초 타임아웃
        );
    
    // 응답 검증
    const validatedResult = validateSummarizeResponse(result);
    
    return NextResponse.json({
      summary: validatedResult.summary,
      usage: validatedResult.usage,
      finishReason: validatedResult.finishReason,
    });
    
  } catch (error) {
    const aiError = analyzeError(error);
    logError(aiError, { content: content?.substring(0, 100), maxLength });
    
    // 폴백 요약 생성
    const fallbackSummary = createFallbackSummary(content || '', maxLength);
    
    return NextResponse.json({
      summary: fallbackSummary,
      usage: {},
      finishReason: 'FALLBACK',
      warning: getUserFriendlyMessage(aiError),
    });
  }
}
