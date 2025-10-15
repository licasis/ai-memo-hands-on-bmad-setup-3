// app/api/tags/route.ts
// 태그 관리 API 엔드포인트
// 태그의 CRUD 작업을 처리하는 API
// 관련 파일: lib/db/queries/tags.ts, components/notes/tag-manager.tsx

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { noteTags, notes } from '@/drizzle/schema';
import { eq, and, inArray } from 'drizzle-orm';

export async function GET(_request: NextRequest) {
  try {
    // 사용자 인증 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    console.log('사용자 ID:', user.id);

    // 데이터베이스 연결
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('DATABASE_URL이 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }

    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client, { schema: { noteTags, notes } });

    console.log('데이터베이스 연결 성공');

    // 먼저 사용자의 노트 ID들을 가져오기
    const userNotes = await db
      .select({ id: notes.id })
      .from(notes)
      .where(and(
        eq(notes.userId, user.id),
        eq(notes.isDeleted, false)
      ));

    console.log('사용자 노트들:', userNotes);

    if (userNotes.length === 0) {
      return NextResponse.json({
        tags: [],
        count: 0,
      });
    }

    const noteIds = userNotes.map(note => note.id);

    // 해당 노트들의 태그 조회
    const allTags = await db
      .select({ 
        tag: noteTags.tag
      })
      .from(noteTags)
      .where(inArray(noteTags.noteId, noteIds));

    console.log('조회된 태그:', allTags);

    // 중복 제거 (JavaScript에서 처리)
    const uniqueTags = [...new Set(allTags.map(item => item.tag))];

    return NextResponse.json({
      tags: uniqueTags,
      count: uniqueTags.length,
    });
  } catch (error) {
    console.error('태그 조회 오류:', error);
    
    // 더 자세한 에러 정보 제공
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    
    return NextResponse.json(
      { 
        error: '태그를 불러올 수 없습니다.',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tag, noteId } = body;

    // 입력 검증
    if (!tag || typeof tag !== 'string') {
      return NextResponse.json(
        { error: '태그 이름이 필요합니다.' },
        { status: 400 }
      );
    }

    if (tag.trim().length === 0) {
      return NextResponse.json(
        { error: '태그 이름을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (tag.length > 100) {
      return NextResponse.json(
        { error: '태그 이름은 100자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 데이터베이스 연결
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client, { schema: { noteTags, notes } });

    // noteId가 제공된 경우 해당 노트에 태그 추가
    if (noteId) {
      // 노트 소유권 확인
      const note = await db
        .select()
        .from(notes)
        .where(and(
          eq(notes.id, noteId),
          eq(notes.userId, user.id),
          eq(notes.isDeleted, false)
        ))
        .limit(1);

      if (note.length === 0) {
        return NextResponse.json(
          { error: '노트를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 중복 태그 확인
      const existingTag = await db
        .select()
        .from(noteTags)
        .where(and(
          eq(noteTags.noteId, noteId),
          eq(noteTags.tag, tag.trim())
        ))
        .limit(1);

      if (existingTag.length > 0) {
        return NextResponse.json(
          { error: '이미 존재하는 태그입니다.' },
          { status: 409 }
        );
      }

      // 태그 추가
      const [newTag] = await db
        .insert(noteTags)
        .values({
          noteId,
          tag: tag.trim(),
        })
        .returning();

      return NextResponse.json({
        success: true,
        tag: newTag,
        message: '태그가 추가되었습니다.',
      });
    }

    // noteId가 없는 경우 - 태그 관리 페이지에서 사용
    // 사용자의 기존 노트 중 하나에 태그를 추가하거나, 임시로 태그만 저장
    // 현재는 사용자의 첫 번째 노트에 태그를 추가하는 방식으로 구현
    
    // 사용자의 첫 번째 노트 찾기
    const userNotes = await db
      .select({ id: notes.id })
      .from(notes)
      .where(and(
        eq(notes.userId, user.id),
        eq(notes.isDeleted, false)
      ))
      .orderBy(notes.createdAt)
      .limit(1);

    if (userNotes.length === 0) {
      return NextResponse.json(
        { error: '태그를 추가하려면 먼저 노트를 생성해주세요.' },
        { status: 400 }
      );
    }

    const firstNoteId = userNotes[0].id;

    // 중복 태그 확인 (사용자의 모든 노트에서)
    const existingTag = await db
      .select()
      .from(noteTags)
      .innerJoin(notes, eq(noteTags.noteId, notes.id))
      .where(and(
        eq(notes.userId, user.id),
        eq(noteTags.tag, tag.trim())
      ))
      .limit(1);

    if (existingTag.length > 0) {
      return NextResponse.json(
        { error: '이미 존재하는 태그입니다.' },
        { status: 409 }
      );
    }

    // 첫 번째 노트에 태그 추가
    const [newTag] = await db
      .insert(noteTags)
      .values({
        noteId: firstNoteId,
        tag: tag.trim(),
      })
      .returning();

    console.log('태그 추가 성공:', newTag);

    return NextResponse.json({
      success: true,
      tag: newTag,
      message: '태그가 추가되었습니다.',
    });
  } catch (error) {
    console.error('태그 추가 오류:', error);
    return NextResponse.json(
      { error: '태그 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('id');

    if (!tagId) {
      return NextResponse.json(
        { error: '태그 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 데이터베이스 연결
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client, { schema: { noteTags, notes } });

    // 태그 소유권 확인
    const tagToDelete = await db
      .select()
      .from(noteTags)
      .innerJoin(notes, eq(noteTags.noteId, notes.id))
      .where(and(
        eq(noteTags.id, tagId),
        eq(notes.userId, user.id)
      ))
      .limit(1);

    if (tagToDelete.length === 0) {
      return NextResponse.json(
        { error: '태그를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 태그 삭제
    await db
      .delete(noteTags)
      .where(eq(noteTags.id, tagId));

    return NextResponse.json({
      success: true,
      message: '태그가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('태그 삭제 오류:', error);
    return NextResponse.json(
      { error: '태그 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
