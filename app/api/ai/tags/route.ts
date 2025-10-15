// app/api/ai/tags/route.ts
// 노트 태그 생성을 위한 API 엔드포인트
// Gemini API를 사용하여 노트 내용에서 관련 태그를 추출합니다
// 관련 파일: lib/ai/gemini.ts, lib/ai/config.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/gemini';
import { getGeminiConfig } from '@/lib/ai/config';
import { callGeminiWithRetry } from '@/lib/ai/retry-utils';
import { callGeminiWithTimeout } from '@/lib/ai/timeout-utils';
import { analyzeError, logError, getUserFriendlyMessage } from '@/lib/ai/error-handler';
import { validateTagsResponse } from '@/lib/ai/response-validator';
import { createFallbackTags } from '@/lib/ai/fallback-handler';
import { estimateTokens } from '@/lib/ai/token-utils';

export async function POST(request: NextRequest) {
  try {
    const { content, maxTags = 5 } = await request.json();
    
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
    
    // 태그 생성 프롬프트
    const prompt = `다음 노트 내용을 분석하여 ${maxTags}개 이하의 관련 태그를 생성해주세요. 태그는 쉼표로 구분하고, 한국어로 작성해주세요. 태그는 간결하고 명확해야 합니다:

${content}

태그:`;
    
    // 재시도 및 타임아웃과 함께 API 호출
    const result = await callGeminiWithTimeout(
      () => callGeminiWithRetry(
        () => generateText(prompt, {
          maxTokens: 100,
          temperature: 0.5,
        })
      ),
      30000 // 30초 타임아웃
    );
    
    // 응답 검증
    const validatedResult = validateTagsResponse(result);
    
    return NextResponse.json({
      tags: validatedResult.tags,
      usage: validatedResult.usage,
      finishReason: validatedResult.finishReason,
    });
    
  } catch (error) {
    const aiError = analyzeError(error);
    logError(aiError, {});

    // 폴백 태그 생성 (content가 없으므로 빈 문자열 사용)
    const fallbackTags = createFallbackTags('', 5);
    
    return NextResponse.json({
      tags: fallbackTags,
      usage: {},
      finishReason: 'FALLBACK',
      warning: getUserFriendlyMessage(aiError),
    });
  }
}
