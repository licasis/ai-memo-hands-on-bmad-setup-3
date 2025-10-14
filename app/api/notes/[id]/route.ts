// app/api/notes/[id]/route.ts
// 노트 API 라우트
// 노트 삭제 등의 API 요청을 처리하는 라우트
// 관련 파일: app/notes/[id]/actions.ts, lib/db/queries/notes.ts

import { NextRequest, NextResponse } from 'next/server';
import { deleteNoteAction } from '@/app/notes/[id]/actions';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const result = await deleteNoteAction(id);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
