// app/notes/[id]/edit/actions.ts
// 노트 편집 서버 액션
// 노트 업데이트를 처리하는 서버 액션
// 관련 파일: lib/db/queries/notes.ts, components/notes/note-editor.tsx

'use server';

import { updateNote as dbUpdateNote } from '@/lib/db/queries/notes';

export interface UpdateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteResult {
  success: boolean;
  error?: string;
}

export async function updateNote(
  noteId: string,
  data: UpdateNoteData
): Promise<UpdateNoteResult> {
  try {
    // 실제 사용자 인증
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }
    
    const userId = user.id;

    // 데이터 검증
    if (!data.title?.trim() || !data.content?.trim()) {
      return {
        success: false,
        error: '제목과 본문을 모두 입력해주세요.',
      };
    }

    // 노트 업데이트
    const updatedNote = await dbUpdateNote(noteId, userId, {
      title: data.title.trim(),
      content: data.content.trim(),
    });

    if (!updatedNote) {
      return {
        success: false,
        error: '노트를 찾을 수 없거나 업데이트 권한이 없습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('노트 업데이트 오류:', error);
    return {
      success: false,
      error: '노트 업데이트 중 오류가 발생했습니다.',
    };
  }
}
