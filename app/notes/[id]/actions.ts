// app/notes/[id]/actions.ts
// 노트 상세 페이지 서버 액션
// 노트 삭제(soft delete)를 처리하는 서버 액션
// 관련 파일: lib/db/queries/notes.ts, components/notes/delete-confirm-dialog.tsx

'use server';

import { softDeleteNote } from '@/lib/db/queries/notes';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface SoftDeleteNoteResult {
  success: boolean;
  error?: string;
}

// 노트 Soft Delete (휴지통으로 이동)
export async function softDeleteNoteAction(noteId: string): Promise<SoftDeleteNoteResult> {
  try {
    // 임시로 인증을 우회하여 메모 기능 테스트
    const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

    // 실제 Supabase 인증 사용 시
    // const supabase = await createClient();
    // const { data: { user }, error: authError } = await supabase.auth.getUser();
    // if (authError || !user) {
    //   return { success: false, error: '인증되지 않은 사용자입니다.' };
    // }
    // const userId = user.id;

    const deletedNote = await softDeleteNote(noteId, mockUserId);

    if (!deletedNote) {
      return {
        success: false,
        error: '노트를 찾을 수 없거나 삭제할 수 없습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('노트 삭제 오류:', error);
    return {
      success: false,
      error: '노트 삭제 중 오류가 발생했습니다.',
    };
  }
}

// 기존 deleteNoteAction을 softDeleteNoteAction으로 변경
export async function deleteNoteAction(noteId: string) {
  const result = await softDeleteNoteAction(noteId);
  
  if (result.success) {
    redirect('/notes');
  } else {
    throw new Error(result.error);
  }
}