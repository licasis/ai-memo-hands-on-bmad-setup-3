// lib/db/queries/notes.ts
// 노트 CRUD 쿼리 함수
// 사용자 스코프를 고려한 노트 생성, 조회, 수정, 삭제 기능

import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '../index';
import { notes, type Note, type NewNote } from '../../../drizzle/schema';

// 노트 생성
export async function createNote(data: Omit<NewNote, 'id' | 'createdAt' | 'updatedAt'>) {
  const [note] = await db
    .insert(notes)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  return note;
}

// 사용자의 모든 노트 조회 (페이지네이션 지원)
export async function getNotesByUserId(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'createdAt' | 'updatedAt' | 'title';
    orderDirection?: 'asc' | 'desc';
  } = {}
) {
  const { limit = 10, offset = 0, orderBy = 'updatedAt', orderDirection = 'desc' } = options;
  
  const orderColumn = orderBy === 'title' ? notes.title : 
                     orderBy === 'createdAt' ? notes.createdAt : 
                     notes.updatedAt;
  
  const orderFn = orderDirection === 'asc' ? asc : desc;
  
  return await db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(orderFn(orderColumn))
    .limit(limit)
    .offset(offset);
}

// 특정 노트 조회 (사용자 스코프 확인)
export async function getNoteById(noteId: string, userId: string) {
  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  
  return note;
}

// 노트 수정
export async function updateNote(
  noteId: string,
  userId: string,
  data: Partial<Pick<Note, 'title' | 'content'>>
) {
  const [updatedNote] = await db
    .update(notes)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .returning();
  
  return updatedNote;
}

// 노트 삭제
export async function deleteNote(noteId: string, userId: string) {
  const [deletedNote] = await db
    .delete(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .returning();
  
  return deletedNote;
}

// 사용자의 노트 총 개수 조회
export async function getNotesCountByUserId(userId: string) {
  const [result] = await db
    .select({ count: notes.id })
    .from(notes)
    .where(eq(notes.userId, userId));
  
  return result?.count || 0;
}
