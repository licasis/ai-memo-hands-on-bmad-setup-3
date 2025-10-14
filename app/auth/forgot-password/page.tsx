// app/auth/forgot-password/page.tsx
// 비밀번호 재설정 요청 페이지
// 사용자가 이메일을 입력하여 비밀번호 재설정 요청을 할 수 있는 페이지입니다
// 관련 파일: components/auth/forgot-password-form.tsx, app/auth/forgot-password/actions.ts

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AI 메모장
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            비밀번호를 재설정하세요
          </p>
        </div>
        
        <ForgotPasswordForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            비밀번호를 기억하셨나요?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
