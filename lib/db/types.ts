// lib/db/types.ts
// Drizzle ORM에서 생성된 타입 정의
// 타입 안전성을 보장하기 위한 중앙 집중식 타입 관리

import type { 
  Note, 
  NewNote, 
  NoteTag, 
  NewNoteTag, 
  Summary, 
  NewSummary 
} from '../../drizzle/schema';

// 기본 엔티티 타입
export type { Note, NewNote, NoteTag, NewNoteTag, Summary, NewSummary };

// 노트 관련 타입
export interface NoteWithTags extends Note {
  tags: NoteTag[];
}

export interface NoteWithSummary extends Note {
  summary?: Summary;
}

export interface NoteWithTagsAndSummary extends Note {
  tags: NoteTag[];
  summary?: Summary;
}

// 노트 생성/수정용 타입
export interface CreateNoteData {
  userId: string;
  title: string;
  content: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
}

// 노트 조회 옵션 타입
export interface GetNotesOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'title';
  orderDirection?: 'asc' | 'desc';
}

// 태그 관련 타입
export interface CreateTagData {
  noteId: string;
  tag: string;
}

export interface TagWithNoteCount {
  tag: string;
  count: number;
}

// 요약 관련 타입
export interface CreateSummaryData {
  noteId: string;
  model: string;
  content: string;
}

export interface SummaryWithNote extends Summary {
  noteTitle: string;
}

// 페이지네이션 타입
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 데이터베이스 연결 상태 타입
export interface DatabaseStatus {
  connected: boolean;
  error?: string;
  lastChecked: Date;
}
