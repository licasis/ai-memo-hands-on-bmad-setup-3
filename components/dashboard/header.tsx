// components/dashboard/header.tsx
// 대시보드 헤더 컴포넌트
// 로그아웃 버튼과 사용자 정보를 포함한 헤더입니다
// 관련 파일: components/auth/logout-button.tsx, app/dashboard/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { LogoutButton } from '@/components/auth/logout-button'

interface DashboardHeaderProps {
  userEmail?: string
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState<string>('')

  // MCP를 이용한 인사말 생성
  useEffect(() => {
    const generateGreeting = async () => {
      if (!userEmail) return;

      try {
        // 이메일에서 사용자 이름 추출
        const userName = userEmail.split('@')[0];

        const response = await fetch('/api/mcp/greeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userName,
            language: '일본어'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.greeting) {
            setGreeting(data.greeting);
          }
        }
      } catch (error) {
        console.error('인사말 생성 실패:', error);
        // 기본 인사말 설정
        const userName = userEmail.split('@')[0];
        setGreeting(`こんにちは、${userName}さん！`);
      }
    };

    generateGreeting();
  }, [userEmail]);

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
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {greeting || '인사말 로딩 중...'}
                </div>
                <div className="text-xs text-gray-500">
                  {userEmail}
                </div>
              </div>
            )}
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
