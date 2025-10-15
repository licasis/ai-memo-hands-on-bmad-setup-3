// app/api/notes/[id]/view/route.ts
// 노트 조회 시 마지막으로 본 시간을 업데이트하는 API 엔드포인트
// 노트 상세 페이지 접근 시 호출되어 lastViewedAt 필드를 현재 시간으로 업데이트

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { notes } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: noteId } = await params;
    console.log('Updating view time for note:', noteId, 'user:', userData.user.id);
    
    // 노트가 존재하고 사용자가 소유자인지 확인
    const [note] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    if (note.userId !== userData.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // lastViewedAt을 현재 시간으로 업데이트
    const [updatedNote] = await db
      .update(notes)
      .set({
        lastViewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId))
      .returning();

    console.log('Updated note:', updatedNote);
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note view time:', error);
    return NextResponse.json({ error: 'Failed to update note view time' }, { status: 500 });
  }
}
