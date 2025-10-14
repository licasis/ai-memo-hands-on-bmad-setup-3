// lib/db/queries/tags.ts
// 태그 CRUD 쿼리 함수
// 노트 태그 생성, 조회, 삭제 기능

import { eq, and, inArray } from 'drizzle-orm';
import { db } from '../index';
import { noteTags, notes, type NoteTag, type NewNoteTag } from '../../../drizzle/schema';

// 노트에 태그 추가
export async function addTagToNote(noteId: string, userId: string, tag: string) {
  // 먼저 노트가 사용자 소유인지 확인
  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  
  if (!note.length) {
    throw new Error('노트를 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  const [newTag] = await db
    .insert(noteTags)
    .values({
      noteId,
      tag,
      createdAt: new Date(),
    })
    .returning();
  
  return newTag;
}

// 노트의 모든 태그 조회
export async function getTagsByNoteId(noteId: string, userId: string) {
  // 먼저 노트가 사용자 소유인지 확인
  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  
  if (!note.length) {
    throw new Error('노트를 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  return await db
    .select()
    .from(noteTags)
    .where(eq(noteTags.noteId, noteId));
}

// 사용자의 모든 태그 조회 (중복 제거)
export async function getAllTagsByUserId(userId: string) {
  return await db
    .selectDistinct({ tag: noteTags.tag })
    .from(noteTags)
    .innerJoin(notes, eq(noteTags.noteId, notes.id))
    .where(eq(notes.userId, userId));
}

// 특정 태그로 노트 검색
export async function getNotesByTag(userId: string, tag: string) {
  return await db
    .select({
      id: notes.id,
      userId: notes.userId,
      title: notes.title,
      content: notes.content,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .innerJoin(noteTags, eq(notes.id, noteTags.noteId))
    .where(and(eq(notes.userId, userId), eq(noteTags.tag, tag)));
}

// 노트에서 태그 삭제
export async function removeTagFromNote(noteId: string, userId: string, tag: string) {
  // 먼저 노트가 사용자 소유인지 확인
  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  
  if (!note.length) {
    throw new Error('노트를 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  const [deletedTag] = await db
    .delete(noteTags)
    .where(and(eq(noteTags.noteId, noteId), eq(noteTags.tag, tag)))
    .returning();
  
  return deletedTag;
}

// 노트 삭제 시 관련 태그도 함께 삭제 (CASCADE로 자동 처리됨)
export async function removeAllTagsFromNote(noteId: string, userId: string) {
  // 먼저 노트가 사용자 소유인지 확인
  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  
  if (!note.length) {
    throw new Error('노트를 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  return await db
    .delete(noteTags)
    .where(eq(noteTags.noteId, noteId));
}
