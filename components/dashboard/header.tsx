// components/dashboard/header.tsx
// 대시보드 헤더 컴포넌트
// 로그아웃 버튼과 사용자 정보를 포함한 헤더입니다
// 관련 파일: components/auth/logout-button.tsx, app/dashboard/page.tsx

'use client'

import { LogoutButton } from '@/components/auth/logout-button'

interface DashboardHeaderProps {
  userEmail?: string
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              AI 메모장
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {userEmail && (
              <span className="text-sm text-gray-600">
                {userEmail}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
