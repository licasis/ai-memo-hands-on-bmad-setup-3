// app/api/ai/generate-tags/route.ts
// AI 태그 생성 API 엔드포인트
// Gemini API를 사용하여 노트 내용에서 태그를 자동 생성하는 API
// 관련 파일: lib/ai/gemini.ts, components/notes/ai-tag-button.tsx

import { NextRequest, NextResponse } from 'next/server';
import { generateTags } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, maxTags = 6, language = 'both' } = body;

    // 입력 검증
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '노트 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: '태그 생성을 위해서는 최소 10자 이상의 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    if (maxTags < 1 || maxTags > 10) {
      return NextResponse.json(
        { error: '태그 개수는 1-10개 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (!['ko', 'en', 'both'].includes(language)) {
      return NextResponse.json(
        { error: '지원하지 않는 언어 설정입니다.' },
        { status: 400 }
      );
    }

    // Gemini API를 사용하여 태그 생성
    const tags = await generateTags(content, {
      maxTags,
      language,
    });

    return NextResponse.json({
      tags,
      count: tags.length,
      language,
      maxTags,
    });
  } catch (error) {
    console.error('태그 생성 API 오류:', error);
    
    // 에러 타입에 따른 적절한 응답
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'AI 서비스 설정에 문제가 있습니다. 관리자에게 문의하세요.' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('QUOTA')) {
        return NextResponse.json(
          { error: 'AI 서비스 사용량을 초과했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('TIMEOUT')) {
        return NextResponse.json(
          { error: '요청 시간이 초과되었습니다. 다시 시도해주세요.' },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: '태그 생성 중 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
