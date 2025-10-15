// app/api/notes/[id]/toggle-check/route.ts
// 노트 체크박스 상태 토글 API
// 노트의 체크 상태를 변경하는 엔드포인트

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { notes } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const { id: noteId } = await params;
    const body = await request.json();
    const { isChecked } = body;

    if (typeof isChecked !== 'boolean') {
      return NextResponse.json(
        { error: 'isChecked는 boolean 값이어야 합니다.' },
        { status: 400 }
      );
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }

    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client, { schema: { notes } });

    // 노트 존재 여부 및 소유권 확인
    const existingNote = await db
      .select()
      .from(notes)
      .where(and(
        eq(notes.id, noteId),
        eq(notes.userId, user.id),
        eq(notes.isDeleted, false)
      ))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: '노트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 체크 상태 업데이트
    const [updatedNote] = await db
      .update(notes)
      .set({
        isChecked,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId))
      .returning();

    return NextResponse.json({
      success: true,
      note: updatedNote,
      message: `노트가 ${isChecked ? '체크' : '언체크'}되었습니다.`,
    });
  } catch (error) {
    console.error('체크 상태 토글 오류:', error);
    return NextResponse.json(
      { error: '체크 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
