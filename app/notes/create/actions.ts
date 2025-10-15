// app/notes/create/actions.ts
// 노트 생성 서버 액션
// 사용자 인증 확인 후 Drizzle ORM을 통해 노트를 데이터베이스에 저장
// 관련 파일: lib/db/queries/notes.ts, lib/supabase/server.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { notes } from '@/drizzle/schema';
// 클라이언트에서 전달받는 데이터 타입
interface CreateNoteRequest {
  title: string;
  content: string;
}
import { redirect } from 'next/navigation';

export interface CreateNoteResult {
  success: boolean;
  error?: string;
  noteId?: string;
}

export async function createNote(data: CreateNoteRequest): Promise<CreateNoteResult> {
  try {
    // 실제 사용자 인증
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return {
        success: false,
        error: '로그인이 필요합니다.',
      };
    }
    
    const userId = user.id;

    // 노트 데이터 검증
    if (!data.title?.trim() || !data.content?.trim()) {
      return {
        success: false,
        error: '제목과 본문을 모두 입력해주세요.',
      };
    }

    // 데이터베이스 연결
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client, { schema: { notes } });

    // 노트 생성
    const now = new Date();
    const [note] = await db
      .insert(notes)
      .values({
        userId: userId,
        title: data.title.trim(),
        content: data.content.trim(),
        lastViewedAt: now, // 새 노트 생성 시 마지막 조회 시간을 현재 시간으로 설정
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return {
      success: true,
      noteId: note.id,
    };
  } catch (error) {
    console.error('노트 생성 오류:', error);
    return {
      success: false,
      error: '노트 생성 중 오류가 발생했습니다.',
    };
  }
}

export async function createNoteAndRedirect(data: CreateNoteRequest) {
  const result = await createNote(data);
  
  if (result.success) {
    redirect('/notes');
  } else {
    throw new Error(result.error);
  }
}
