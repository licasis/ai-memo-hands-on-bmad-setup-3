// __tests__/db/types.test.ts
// 타입 안전성 테스트
// Drizzle ORM 타입 정의의 정확성을 검증

import { describe, it, expect } from '@jest/globals';
import type { 
  Note, 
  NewNote, 
  NoteTag, 
  NewNoteTag, 
  Summary, 
  NewSummary,
  CreateNoteData,
  UpdateNoteData,
  GetNotesOptions,
  CreateTagData,
  CreateSummaryData
} from '../../lib/db/types';

describe('Database Types', () => {
  describe('Note Types', () => {
    it('should have correct Note type structure', () => {
      const note: Note = {
        id: 'test-id',
        userId: 'user-id',
        title: 'Test Note',
        content: 'Test content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(note).toHaveProperty('id');
      expect(note).toHaveProperty('userId');
      expect(note).toHaveProperty('title');
      expect(note).toHaveProperty('content');
      expect(note).toHaveProperty('createdAt');
      expect(note).toHaveProperty('updatedAt');
    });

    it('should have correct NewNote type structure', () => {
      const newNote: NewNote = {
        userId: 'user-id',
        title: 'Test Note',
        content: 'Test content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(newNote).toHaveProperty('userId');
      expect(newNote).toHaveProperty('title');
      expect(newNote).toHaveProperty('content');
      expect(newNote).toHaveProperty('createdAt');
      expect(newNote).toHaveProperty('updatedAt');
      expect(newNote).not.toHaveProperty('id');
    });

    it('should have correct CreateNoteData type structure', () => {
      const createData: CreateNoteData = {
        userId: 'user-id',
        title: 'Test Note',
        content: 'Test content',
      };

      expect(createData).toHaveProperty('userId');
      expect(createData).toHaveProperty('title');
      expect(createData).toHaveProperty('content');
      expect(createData).not.toHaveProperty('id');
      expect(createData).not.toHaveProperty('createdAt');
      expect(createData).not.toHaveProperty('updatedAt');
    });

    it('should have correct UpdateNoteData type structure', () => {
      const updateData: UpdateNoteData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      expect(updateData).toHaveProperty('title');
      expect(updateData).toHaveProperty('content');
      expect(updateData).not.toHaveProperty('id');
      expect(updateData).not.toHaveProperty('userId');
    });
  });

  describe('Tag Types', () => {
    it('should have correct NoteTag type structure', () => {
      const tag: NoteTag = {
        id: 'tag-id',
        noteId: 'note-id',
        tag: 'test-tag',
        createdAt: new Date(),
      };

      expect(tag).toHaveProperty('id');
      expect(tag).toHaveProperty('noteId');
      expect(tag).toHaveProperty('tag');
      expect(tag).toHaveProperty('createdAt');
    });

    it('should have correct CreateTagData type structure', () => {
      const createTag: CreateTagData = {
        noteId: 'note-id',
        tag: 'test-tag',
      };

      expect(createTag).toHaveProperty('noteId');
      expect(createTag).toHaveProperty('tag');
      expect(createTag).not.toHaveProperty('id');
      expect(createTag).not.toHaveProperty('createdAt');
    });
  });

  describe('Summary Types', () => {
    it('should have correct Summary type structure', () => {
      const summary: Summary = {
        id: 'summary-id',
        noteId: 'note-id',
        model: 'gemini-pro',
        content: 'AI generated summary',
        createdAt: new Date(),
      };

      expect(summary).toHaveProperty('id');
      expect(summary).toHaveProperty('noteId');
      expect(summary).toHaveProperty('model');
      expect(summary).toHaveProperty('content');
      expect(summary).toHaveProperty('createdAt');
    });

    it('should have correct CreateSummaryData type structure', () => {
      const createSummary: CreateSummaryData = {
        noteId: 'note-id',
        model: 'gemini-pro',
        content: 'AI generated summary',
      };

      expect(createSummary).toHaveProperty('noteId');
      expect(createSummary).toHaveProperty('model');
      expect(createSummary).toHaveProperty('content');
      expect(createSummary).not.toHaveProperty('id');
      expect(createSummary).not.toHaveProperty('createdAt');
    });
  });

  describe('Options Types', () => {
    it('should have correct GetNotesOptions type structure', () => {
      const options: GetNotesOptions = {
        limit: 10,
        offset: 0,
        orderBy: 'createdAt',
        orderDirection: 'desc',
      };

      expect(options).toHaveProperty('limit');
      expect(options).toHaveProperty('offset');
      expect(options).toHaveProperty('orderBy');
      expect(options).toHaveProperty('orderDirection');
    });
  });
});
