// app/auth/login/page.tsx
// 로그인 페이지
// 사용자가 이메일과 비밀번호로 로그인할 수 있는 페이지입니다
// 관련 파일: components/auth/login-form.tsx, app/auth/login/actions.ts

'use client';

import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [dashboardUrl, setDashboardUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      setDashboardUrl(`${baseUrl}/dashboard`);
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AI 메모장
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            계정에 로그인하세요
          </p>
        </div>
        
        <LoginForm />

        {/* 대시보드 QR 코드 */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            로그인 후 바로 대시보드로 이동
          </p>
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              {dashboardUrl && (
                <QRCode
                  value={dashboardUrl}
                  size={100}
                  level="M"
                />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            QR 코드 스캔으로 대시보드 바로가기
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
