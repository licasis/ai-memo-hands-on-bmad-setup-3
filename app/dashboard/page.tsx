// app/dashboard/page.tsx
// 대시보드 페이지
// 로그인한 사용자를 위한 메인 대시보드입니다
// 관련 파일: components/auth/login-form.tsx, components/auth/signup-form.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // 사용자 인증 확인
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                AI 메모장 대시보드
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                안녕하세요, {user.email}님!
              </p>
              <p className="text-gray-500">
                메모 작성 기능이 곧 추가될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
