// app/auth/login/actions.ts
// 로그인 서버 액션
// Supabase Auth를 사용하여 사용자 로그인을 처리합니다
// 관련 파일: components/auth/login-form.tsx, lib/supabase/server.ts

'use server'

import { createClient } from '@/lib/supabase/server'

export interface SignInResult {
  success: boolean
  error?: string
}

export async function signInAction({ 
  email, 
  password 
}: { 
  email: string
  password: string 
}): Promise<SignInResult> {
  try {
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: '유효한 이메일 주소를 입력해주세요.'
      }
    }

    // 비밀번호 입력 검사
    if (!password.trim()) {
      return {
        success: false,
        error: '비밀번호를 입력해주세요.'
      }
    }

    const supabase = await createClient()

    // Supabase Auth를 사용한 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // 에러 타입에 따른 메시지 처리
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: '이메일 또는 비밀번호가 올바르지 않습니다.'
        }
      }
      
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
        }
      }
      
      return {
        success: false,
        error: error.message
      }
    }

    if (data.user) {
      // 로그인 성공
      return {
        success: true
      }
    }

    return {
      success: false,
      error: '로그인 중 오류가 발생했습니다.'
    }

  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: '서버 오류가 발생했습니다.'
    }
  }
}
