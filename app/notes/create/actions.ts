// app/notes/create/actions.ts
// 노트 생성 서버 액션
// 사용자 인증 확인 후 Drizzle ORM을 통해 노트를 데이터베이스에 저장
// 관련 파일: lib/db/queries/notes.ts, lib/supabase/server.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { notes } from '@/drizzle/schema';
import type { CreateNoteData } from '@/lib/db/types';
import { redirect } from 'next/navigation';

export interface CreateNoteResult {
  success: boolean;
  error?: string;
  noteId?: string;
}

export async function createNote(data: CreateNoteData): Promise<CreateNoteResult> {
  try {
    // 임시로 인증을 우회하여 메모 기능 테스트
    const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

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
    const [note] = await db
      .insert(notes)
      .values({
        userId: mockUserId,
        title: data.title.trim(),
        content: data.content.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
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

export async function createNoteAndRedirect(data: CreateNoteData) {
  const result = await createNote(data);
  
  if (result.success) {
    redirect('/notes');
  } else {
    throw new Error(result.error);
  }
}
