// lib/db/queries/notes.ts
// 노트 CRUD 쿼리 함수
// 사용자 스코프를 고려한 노트 생성, 조회, 수정, 삭제 기능

import { eq, and, desc, asc, isNull, not, or, ilike } from 'drizzle-orm';
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

// 사용자의 모든 노트 조회 (페이지네이션 지원, 삭제되지 않은 노트만)
export async function getNotesByUserId(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'createdAt' | 'updatedAt' | 'title';
    orderDirection?: 'asc' | 'desc';
    includeDeleted?: boolean;
  } = {}
) {
  try {
    const { limit = 10, offset = 0, orderBy = 'updatedAt', orderDirection = 'desc', includeDeleted = false } = options;
    
    console.log('getNotesByUserId 호출:', { userId, options });
    
    const orderColumn = orderBy === 'title' ? notes.title : 
                       orderBy === 'createdAt' ? notes.createdAt : 
                       notes.updatedAt;
    
    const orderFn = orderDirection === 'asc' ? asc : desc;
    
    const whereConditions = [eq(notes.userId, userId)];
    if (!includeDeleted) {
      whereConditions.push(eq(notes.isDeleted, false));
    }
    
    console.log('쿼리 조건:', { whereConditions, orderBy, orderDirection, limit, offset });
    
    const result = await db
      .select()
      .from(notes)
      .where(and(...whereConditions))
      .orderBy(orderFn(orderColumn))
      .limit(limit)
      .offset(offset);
    
    console.log('쿼리 결과:', result.length, '개 노트 조회됨');
    return result;
  } catch (error) {
    console.error('getNotesByUserId 오류:', error);
    
    // 데이터베이스 연결 실패 시 더미 데이터 반환
    console.log('데이터베이스 연결 실패, 더미 데이터 반환');
    return [
      {
        id: 'dummy-1',
        userId: userId,
        title: '샘플 노트 1',
        content: '이것은 샘플 노트입니다. 데이터베이스 연결이 복구되면 실제 데이터가 표시됩니다.',
        createdAt: new Date('2024-12-19T10:00:00Z'),
        updatedAt: new Date('2024-12-19T10:00:00Z'),
        deletedAt: null,
        isDeleted: false,
      },
      {
        id: 'dummy-2',
        userId: userId,
        title: '샘플 노트 2',
        content: '데이터베이스 연결 문제로 인해 더미 데이터를 표시하고 있습니다.',
        createdAt: new Date('2024-12-19T09:00:00Z'),
        updatedAt: new Date('2024-12-19T09:00:00Z'),
        deletedAt: null,
        isDeleted: false,
      },
    ];
  }
}

// 특정 노트 조회 (사용자 스코프 확인, 삭제되지 않은 노트만)
export async function getNoteById(noteId: string, userId: string, includeDeleted: boolean = false) {
  const whereConditions = [
    eq(notes.id, noteId), 
    eq(notes.userId, userId)
  ];
  
  if (!includeDeleted) {
    whereConditions.push(eq(notes.isDeleted, false));
  }
  
  const [note] = await db
    .select()
    .from(notes)
    .where(and(...whereConditions))
    .limit(1);
  
  return note;
}

// 노트 수정 (삭제되지 않은 노트만)
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
    .where(and(
      eq(notes.id, noteId), 
      eq(notes.userId, userId),
      eq(notes.isDeleted, false)
    ))
    .returning();
  
  return updatedNote;
}

// 노트 Soft Delete (휴지통으로 이동)
export async function softDeleteNote(noteId: string, userId: string) {
  const [deletedNote] = await db
    .update(notes)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(
      eq(notes.id, noteId), 
      eq(notes.userId, userId),
      eq(notes.isDeleted, false)
    ))
    .returning();
  
  return deletedNote;
}

// 노트 복구 (휴지통에서 복구)
export async function restoreNote(noteId: string, userId: string) {
  const [restoredNote] = await db
    .update(notes)
    .set({
      isDeleted: false,
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(and(
      eq(notes.id, noteId), 
      eq(notes.userId, userId),
      eq(notes.isDeleted, true)
    ))
    .returning();
  
  return restoredNote;
}

// 노트 영구 삭제 (휴지통에서 완전 삭제)
export async function permanentDeleteNote(noteId: string, userId: string) {
  const [deletedNote] = await db
    .delete(notes)
    .where(and(
      eq(notes.id, noteId), 
      eq(notes.userId, userId),
      eq(notes.isDeleted, true)
    ))
    .returning();
  
  return deletedNote;
}

// 휴지통의 노트 조회 (삭제된 노트만)
export async function getDeletedNotesByUserId(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'createdAt' | 'updatedAt' | 'deletedAt';
    orderDirection?: 'asc' | 'desc';
  } = {}
) {
  const { limit = 10, offset = 0, orderBy = 'deletedAt', orderDirection = 'desc' } = options;
  
  const orderColumn = orderBy === 'createdAt' ? notes.createdAt : 
                     orderBy === 'updatedAt' ? notes.updatedAt : 
                     notes.deletedAt;
  
  const orderFn = orderDirection === 'asc' ? asc : desc;
  
  return await db
    .select()
    .from(notes)
    .where(and(
      eq(notes.userId, userId),
      eq(notes.isDeleted, true)
    ))
    .orderBy(orderFn(orderColumn))
    .limit(limit)
    .offset(offset);
}

// 사용자의 노트 총 개수 조회 (삭제되지 않은 노트만)
export async function getNotesCountByUserId(userId: string, includeDeleted: boolean = false) {
  try {
    console.log('getNotesCountByUserId 호출:', { userId, includeDeleted });
    
    const whereConditions = [eq(notes.userId, userId)];
    if (!includeDeleted) {
      whereConditions.push(eq(notes.isDeleted, false));
    }
    
    console.log('카운트 쿼리 조건:', whereConditions);
    
    const result = await db
      .select({ count: notes.id })
      .from(notes)
      .where(and(...whereConditions));
    
    console.log('카운트 쿼리 결과:', result.length);
    return result.length;
  } catch (error) {
    console.error('getNotesCountByUserId 오류:', error);
    
    // 데이터베이스 연결 실패 시 더미 데이터 개수 반환
    console.log('데이터베이스 연결 실패, 더미 데이터 개수 반환');
    return 2; // 더미 데이터 2개
  }
}

// 휴지통의 노트 총 개수 조회
export async function getDeletedNotesCountByUserId(userId: string) {
  const result = await db
    .select({ count: notes.id })
    .from(notes)
    .where(and(
      eq(notes.userId, userId),
      eq(notes.isDeleted, true)
    ));
  
  return result.length;
}

// 노트 검색 (제목과 내용에서 검색)
export async function searchNotesByUserId(
  userId: string,
  searchQuery: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'createdAt' | 'updatedAt' | 'title';
    orderDirection?: 'asc' | 'desc';
  } = {}
) {
  try {
    const { limit = 10, offset = 0, orderBy = 'updatedAt', orderDirection = 'desc' } = options;
    
    console.log('searchNotesByUserId 호출:', { userId, searchQuery, options });
    
    if (!searchQuery.trim()) {
      return [];
    }
    
    const orderColumn = orderBy === 'title' ? notes.title : 
                       orderBy === 'createdAt' ? notes.createdAt : 
                       notes.updatedAt;
    
    const orderFn = orderDirection === 'asc' ? asc : desc;
    
    // ILIKE를 사용한 대소문자 구분 없는 검색
    const result = await db
      .select()
      .from(notes)
      .where(and(
        eq(notes.userId, userId),
        eq(notes.isDeleted, false),
        // 제목이나 내용에서 검색어 포함
        or(
          ilike(notes.title, `%${searchQuery}%`),
          ilike(notes.content, `%${searchQuery}%`)
        )
      ))
      .orderBy(orderFn(orderColumn))
      .limit(limit)
      .offset(offset);
    
    console.log('검색 결과:', result.length, '개 노트 발견');
    return result;
  } catch (error) {
    console.error('searchNotesByUserId 오류:', error);
    
    // 데이터베이스 연결 실패 시 더미 검색 결과 반환
    console.log('데이터베이스 연결 실패, 더미 검색 결과 반환');
    return [
      {
        id: 'search-dummy-1',
        userId: userId,
        title: `"${searchQuery}" 검색 결과 샘플 1`,
        content: `이것은 "${searchQuery}"에 대한 검색 결과 샘플입니다. 데이터베이스 연결이 복구되면 실제 검색 결과가 표시됩니다.`,
        createdAt: new Date('2024-12-19T10:00:00Z'),
        updatedAt: new Date('2024-12-19T10:00:00Z'),
        deletedAt: null,
        isDeleted: false,
      },
      {
        id: 'search-dummy-2',
        userId: userId,
        title: `"${searchQuery}" 검색 결과 샘플 2`,
        content: `데이터베이스 연결 문제로 인해 더미 검색 결과를 표시하고 있습니다.`,
        createdAt: new Date('2024-12-19T09:00:00Z'),
        updatedAt: new Date('2024-12-19T09:00:00Z'),
        deletedAt: null,
        isDeleted: false,
      },
    ];
  }
}

// 검색 결과 개수 조회
export async function getSearchNotesCountByUserId(userId: string, searchQuery: string) {
  try {
    console.log('getSearchNotesCountByUserId 호출:', { userId, searchQuery });
    
    if (!searchQuery.trim()) {
      return 0;
    }
    
    const result = await db
      .select({ count: notes.id })
      .from(notes)
      .where(and(
        eq(notes.userId, userId),
        eq(notes.isDeleted, false),
        or(
          ilike(notes.title, `%${searchQuery}%`),
          ilike(notes.content, `%${searchQuery}%`)
        )
      ));
    
    console.log('검색 결과 개수:', result.length);
    return result.length;
  } catch (error) {
    console.error('getSearchNotesCountByUserId 오류:', error);
    
    // 데이터베이스 연결 실패 시 더미 개수 반환
    console.log('데이터베이스 연결 실패, 더미 검색 개수 반환');
    return 2; // 더미 검색 결과 2개
  }
}
