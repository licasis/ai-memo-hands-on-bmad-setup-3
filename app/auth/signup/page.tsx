// app/auth/signup/page.tsx
// 회원가입 페이지
// 사용자가 이메일과 비밀번호로 회원가입할 수 있는 페이지입니다
// 관련 파일: components/auth/signup-form.tsx, app/auth/signup/actions.ts

import { SignupForm } from '@/components/auth/signup-form'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AI 메모장
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            계정을 생성하여 시작하세요
          </p>
        </div>
        
        <SignupForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
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
