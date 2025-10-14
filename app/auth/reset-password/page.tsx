// app/auth/reset-password/page.tsx
// 비밀번호 재설정 페이지
// 이메일 링크를 통해 접근하여 새 비밀번호를 설정할 수 있는 페이지입니다
// 관련 파일: components/auth/reset-password-form.tsx, app/auth/reset-password/actions.ts

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export default async function ResetPasswordPage() {
  const supabase = createClient()
  
  // 사용자 인증 확인 (비밀번호 재설정 링크를 통한 접근)
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/forgot-password')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AI 메모장
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            새 비밀번호를 설정하세요
          </p>
        </div>
        
        <ResetPasswordForm />
      </div>
    </div>
  )
}
