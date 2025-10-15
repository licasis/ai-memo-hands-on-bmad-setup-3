// app/api/ai/tag-settings/route.ts
// 태그 설정 관리를 위한 API 엔드포인트
// 사용자의 태그 설정을 조회하고 업데이트하는 API
// 관련 파일: lib/ai/config.ts, components/notes/tag-settings.tsx

import { NextRequest, NextResponse } from 'next/server';

interface TagSettings {
  maxTags: number;
  language: 'ko' | 'en' | 'both';
  autoApply: boolean;
}

// 임시로 메모리에 설정 저장 (실제로는 데이터베이스에 저장해야 함)
let userSettings: TagSettings | null = null;

export async function GET(_request: NextRequest) {
  try {
    // 임시로 기본 설정 반환
    const defaultSettings = {
      maxTags: 6,
      language: 'both' as 'ko' | 'en' | 'both',
      autoApply: false,
    };

    return NextResponse.json({
      settings: defaultSettings,
    });
  } catch (error) {
    console.error('설정 조회 오류:', error);
    return NextResponse.json(
      { error: '설정을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { maxTags, language, autoApply } = body;

    // 설정 유효성 검사
    if (maxTags && (maxTags < 1 || maxTags > 10)) {
      return NextResponse.json(
        { error: '태그 개수는 1-10개 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (language && !['ko', 'en', 'both'].includes(language)) {
      return NextResponse.json(
        { error: '언어는 ko, en, both 중 하나여야 합니다.' },
        { status: 400 }
      );
    }

    if (typeof autoApply !== 'undefined' && typeof autoApply !== 'boolean') {
      return NextResponse.json(
        { error: '자동 적용 설정은 boolean 값이어야 합니다.' },
        { status: 400 }
      );
    }

    // 설정 업데이트
    const updatedSettings = {
      maxTags: maxTags || 6,
      language: language || 'both',
      autoApply: autoApply || false,
    };

    // 임시로 메모리에 저장
    userSettings = updatedSettings;

    return NextResponse.json({
      settings: updatedSettings,
      message: '설정이 저장되었습니다.',
    });
  } catch (error) {
    console.error('설정 저장 오류:', error);
    return NextResponse.json(
      { error: '설정을 저장할 수 없습니다.' },
      { status: 500 }
    );
  }
}
