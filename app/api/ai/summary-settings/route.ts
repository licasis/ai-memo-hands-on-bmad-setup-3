// app/api/ai/summary-settings/route.ts
// 요약 설정 관리를 위한 API 엔드포인트
// 사용자의 요약 설정을 조회하고 업데이트하는 API
// 관련 파일: lib/ai/config.ts, components/notes/summary-settings.tsx

import { NextRequest, NextResponse } from 'next/server';

// 임시로 메모리에 설정 저장 (실제로는 데이터베이스에 저장해야 함)
let userSettings: Record<string, any> = {};

export async function GET(request: NextRequest) {
  try {
    // 임시로 기본 설정 반환
    const defaultSettings = {
      maxLength: 300,
      style: 'bullet' as 'bullet' | 'paragraph',
      temperature: 0.7,
      autoGenerate: false,
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
    const { maxLength, style, temperature, autoGenerate } = body;

    // 설정 유효성 검사
    if (maxLength && (maxLength < 50 || maxLength > 1000)) {
      return NextResponse.json(
        { error: '요약 길이는 50-1000자 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (style && !['bullet', 'paragraph'].includes(style)) {
      return NextResponse.json(
        { error: '스타일은 bullet 또는 paragraph여야 합니다.' },
        { status: 400 }
      );
    }

    if (temperature && (temperature < 0 || temperature > 1)) {
      return NextResponse.json(
        { error: '온도는 0-1 사이여야 합니다.' },
        { status: 400 }
      );
    }

    // 설정 업데이트
    const updatedSettings = {
      maxLength: maxLength || 300,
      style: style || 'bullet',
      temperature: temperature || 0.7,
      autoGenerate: autoGenerate || false,
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
