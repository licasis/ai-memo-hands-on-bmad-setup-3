// app/trash/actions.ts
// 휴지통 서버 액션
// 노트 복구 및 영구 삭제를 처리하는 서버 액션
// 관련 파일: lib/db/queries/notes.ts, components/trash/restore-confirm-dialog.tsx

'use server';

import { restoreNote, permanentDeleteNote } from '@/lib/db/queries/notes';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface RestoreNoteResult {
  success: boolean;
  error?: string;
}

export interface PermanentDeleteNoteResult {
  success: boolean;
  error?: string;
}

// 노트 복구
export async function restoreNoteAction(noteId: string): Promise<RestoreNoteResult> {
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

    const restoredNote = await restoreNote(noteId, mockUserId);

    if (!restoredNote) {
      return {
        success: false,
        error: '노트를 찾을 수 없거나 복구할 수 없습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('노트 복구 오류:', error);
    return {
      success: false,
      error: '노트 복구 중 오류가 발생했습니다.',
    };
  }
}

// 노트 영구 삭제
export async function permanentDeleteNoteAction(noteId: string): Promise<PermanentDeleteNoteResult> {
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

    const deletedNote = await permanentDeleteNote(noteId, mockUserId);

    if (!deletedNote) {
      return {
        success: false,
        error: '노트를 찾을 수 없거나 영구 삭제할 수 없습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('노트 영구 삭제 오류:', error);
    return {
      success: false,
      error: '노트 영구 삭제 중 오류가 발생했습니다.',
    };
  }
}
