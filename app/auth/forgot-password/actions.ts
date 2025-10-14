// app/auth/forgot-password/actions.ts
// 비밀번호 재설정 요청 서버 액션
// Supabase Auth를 사용하여 비밀번호 재설정 이메일을 발송합니다
// 관련 파일: components/auth/forgot-password-form.tsx, lib/supabase/server.ts

'use server'

import { createClient } from '@/lib/supabase/server'

export interface ForgotPasswordResult {
  success: boolean
  error?: string
}

export async function forgotPasswordAction({ 
  email 
}: { 
  email: string 
}): Promise<ForgotPasswordResult> {
  try {
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: '유효한 이메일 주소를 입력해주세요.'
      }
    }

    const supabase = createClient()

    // Supabase Auth를 사용한 비밀번호 재설정 이메일 발송
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
      // 에러 타입에 따른 메시지 처리
      if (error.message.includes('Invalid email')) {
        return {
          success: false,
          error: '존재하지 않는 이메일 주소입니다.'
        }
      }
      
      return {
        success: false,
        error: error.message
      }
    }

    // 이메일 발송 성공 (보안상 존재하지 않는 이메일이어도 성공 메시지 표시)
    return {
      success: true
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      success: false,
      error: '서버 오류가 발생했습니다.'
    }
  }
}
