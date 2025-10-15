// app/auth/reset-password/actions.ts
// 비밀번호 재설정 서버 액션
// Supabase Auth를 사용하여 사용자 비밀번호를 재설정합니다
// 관련 파일: components/auth/reset-password-form.tsx, lib/supabase/server.ts

'use server'

import { createClient } from '@/lib/supabase/server'

export interface ResetPasswordResult {
  success: boolean
  error?: string
}

export async function resetPasswordAction({ 
  password 
}: { 
  password: string 
}): Promise<ResetPasswordResult> {
  try {
    // 비밀번호 길이 검사
    if (password.length < 8) {
      return {
        success: false,
        error: '비밀번호는 8자 이상이어야 합니다.'
      }
    }

    const supabase = await createClient()

    // Supabase Auth를 사용한 비밀번호 재설정
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      // 에러 타입에 따른 메시지 처리
      if (error.message.includes('Password should be at least')) {
        return {
          success: false,
          error: '비밀번호는 8자 이상이어야 합니다.'
        }
      }
      
      if (error.message.includes('Invalid session')) {
        return {
          success: false,
          error: '비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.'
        }
      }
      
      return {
        success: false,
        error: error.message
      }
    }

    // 비밀번호 재설정 성공
    return {
      success: true
    }

  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      error: '서버 오류가 발생했습니다.'
    }
  }
}
