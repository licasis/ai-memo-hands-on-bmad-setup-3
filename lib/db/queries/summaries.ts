// lib/db/queries/summaries.ts
// 요약 CRUD 쿼리 함수
// AI 생성 요약의 생성, 조회, 삭제 기능

import { eq, and, desc } from 'drizzle-orm';
import { db } from '../index';
import { summaries, notes, type NewSummary } from '../../../drizzle/schema';

// 노트에 요약 추가
export async function createSummary(noteId: string, userId: string, data: Omit<NewSummary, 'id' | 'noteId' | 'createdAt'>) {
  // 먼저 노트가 사용자 소유인지 확인
  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  
  if (!note.length) {
    throw new Error('노트를 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  const [summary] = await db
    .insert(summaries)
    .values({
      ...data,
      noteId,
      createdAt: new Date(),
    })
    .returning();
  
  return summary;
}

// 노트의 모든 요약 조회
export async function getSummariesByNoteId(noteId: string, userId: string) {
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
    .from(summaries)
    .where(eq(summaries.noteId, noteId))
    .orderBy(desc(summaries.createdAt));
}

// 사용자의 모든 요약 조회 (최신순)
export async function getAllSummariesByUserId(userId: string, limit: number = 50) {
  return await db
    .select({
      id: summaries.id,
      noteId: summaries.noteId,
      model: summaries.model,
      content: summaries.content,
      createdAt: summaries.createdAt,
      noteTitle: notes.title,
    })
    .from(summaries)
    .innerJoin(notes, eq(summaries.noteId, notes.id))
    .where(eq(notes.userId, userId))
    .orderBy(desc(summaries.createdAt))
    .limit(limit);
}

// 특정 요약 조회
export async function getSummaryById(summaryId: string, userId: string) {
  const [summary] = await db
    .select({
      id: summaries.id,
      noteId: summaries.noteId,
      model: summaries.model,
      content: summaries.content,
      createdAt: summaries.createdAt,
      noteTitle: notes.title,
    })
    .from(summaries)
    .innerJoin(notes, eq(summaries.noteId, notes.id))
    .where(and(eq(summaries.id, summaryId), eq(notes.userId, userId)))
    .limit(1);
  
  return summary;
}

// 요약 삭제
export async function deleteSummary(summaryId: string, userId: string) {
  // 먼저 요약이 사용자 소유인지 확인
  const summary = await db
    .select()
    .from(summaries)
    .innerJoin(notes, eq(summaries.noteId, notes.id))
    .where(and(eq(summaries.id, summaryId), eq(notes.userId, userId)))
    .limit(1);
  
  if (!summary.length) {
    throw new Error('요약을 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  const [deletedSummary] = await db
    .delete(summaries)
    .where(eq(summaries.id, summaryId))
    .returning();
  
  return deletedSummary;
}

// 노트의 최신 요약 조회
export async function getLatestSummaryByNoteId(noteId: string, userId: string) {
  // 먼저 노트가 사용자 소유인지 확인
  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  
  if (!note.length) {
    throw new Error('노트를 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  const [summary] = await db
    .select()
    .from(summaries)
    .where(eq(summaries.noteId, noteId))
    .orderBy(desc(summaries.createdAt))
    .limit(1);
  
  return summary;
}
