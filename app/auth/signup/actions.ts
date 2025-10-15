// app/auth/signup/actions.ts
// 회원가입 서버 액션
// Supabase Auth를 사용하여 사용자 회원가입을 처리합니다
// 관련 파일: components/auth/signup-form.tsx, lib/supabase/server.ts

'use server'

import { createClient } from '@/lib/supabase/server'

export interface SignUpResult {
  success: boolean
  error?: string
}

export async function signUpAction({ 
  email, 
  password 
}: { 
  email: string
  password: string 
}): Promise<SignUpResult> {
  try {
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: '유효한 이메일 주소를 입력해주세요.'
      }
    }

    // 비밀번호 길이 검사
    if (password.length < 8) {
      return {
        success: false,
        error: '비밀번호는 8자 이상이어야 합니다.'
      }
    }

    const supabase = await createClient()

    // Supabase Auth를 사용한 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      // 에러 타입에 따른 메시지 처리
      if (error.message.includes('already registered')) {
        return {
          success: false,
          error: '이미 존재하는 이메일입니다.'
        }
      }
      
      return {
        success: false,
        error: error.message
      }
    }

    if (data.user) {
      // 회원가입 성공 시 자동 로그인 처리
      // Supabase는 회원가입 후 자동으로 로그인 상태가 됩니다
      return {
        success: true
      }
    }

    return {
      success: false,
      error: '회원가입 중 오류가 발생했습니다.'
    }

  } catch (error) {
    console.error('Signup error:', error)
    return {
      success: false,
      error: '서버 오류가 발생했습니다.'
    }
  }
}
