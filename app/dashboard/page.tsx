// app/dashboard/page.tsx
// 대시보드 페이지
// 로그인한 사용자를 위한 메인 대시보드입니다
// 관련 파일: components/dashboard/header.tsx, components/auth/logout-button.tsx

import Image from 'next/image'
import Link from 'next/link'
import AuthenticatedLayout from '@/components/layout/authenticated-layout'

export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI 메모장 대시보드
            </h1>
            <p className="text-gray-500 mb-8">
              왼쪽 메뉴에서 원하는 기능을 선택하세요.
            </p>
            
            {/* 대시보드 이미지 */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/abc.png"
                alt="Dashboard Image"
                width={400}
                height={300}
                className="max-w-md w-full h-auto rounded-lg shadow-md border border-gray-200"
              />
            </div>
            
            {/* 빠른 액션 버튼들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Link
                href="/notes/create"
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <div className="text-blue-600 font-medium mb-1">새 노트 작성</div>
                <div className="text-sm text-blue-500">아이디어를 빠르게 기록하세요</div>
              </Link>
              
              <Link
                href="/notes"
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              >
                <div className="text-green-600 font-medium mb-1">모든 노트 보기</div>
                <div className="text-sm text-green-500">작성한 노트들을 확인하세요</div>
              </Link>
              
              <Link
                href="/notes/search"
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
              >
                <div className="text-purple-600 font-medium mb-1">노트 검색</div>
                <div className="text-sm text-purple-500">원하는 내용을 찾아보세요</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
