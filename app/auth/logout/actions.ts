// app/auth/logout/actions.ts
// 로그아웃 서버 액션
// Supabase Auth를 사용하여 사용자 로그아웃을 처리합니다
// 관련 파일: components/auth/logout-button.tsx, lib/supabase/server.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface LogoutResult {
  success: boolean
  error?: string
}

export async function logoutAction(): Promise<LogoutResult> {
  try {
    const supabase = await createClient()

    // Supabase Auth를 사용한 로그아웃
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return {
        success: false,
        error: '로그아웃 중 오류가 발생했습니다.'
      }
    }

    // 로그아웃 성공
    return {
      success: true
    }

  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: '서버 오류가 발생했습니다.'
    }
  }
}
