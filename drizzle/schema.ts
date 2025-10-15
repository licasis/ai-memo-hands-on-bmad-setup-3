// drizzle/schema.ts
// 데이터베이스 스키마 정의
// 노트 관리 시스템의 모든 테이블과 관계를 정의

import { pgTable, text, timestamp, uuid, varchar, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// notes 테이블 정의
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // Supabase Auth의 사용자 ID
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  isChecked: boolean('is_checked').default(false), // 체크박스 상태
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete를 위한 삭제 시간
  isDeleted: boolean('is_deleted').default(false), // 삭제 여부
});

// note_tags 테이블 정의
export const noteTags = pgTable('note_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  tag: varchar('tag', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// summaries 테이블 정의
export const summaries = pgTable('summaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  model: varchar('model', { length: 50 }).notNull(), // AI 모델명 (예: 'gemini-pro')
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 테이블 간 관계 정의
export const notesRelations = relations(notes, ({ many }) => ({
  tags: many(noteTags),
  summaries: many(summaries),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteTags.noteId],
    references: [notes.id],
  }),
}));

export const summariesRelations = relations(summaries, ({ one }) => ({
  note: one(notes, {
    fields: [summaries.noteId],
    references: [notes.id],
  }),
}));

// 타입 내보내기 (타입 안전성을 위해)
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type NoteTag = typeof noteTags.$inferSelect;
export type NewNoteTag = typeof noteTags.$inferInsert;
export type Summary = typeof summaries.$inferSelect;
export type NewSummary = typeof summaries.$inferInsert;
