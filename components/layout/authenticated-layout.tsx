// components/layout/authenticated-layout.tsx
// 인증된 사용자를 위한 공통 레이아웃 컴포넌트
// 사이드바와 헤더를 포함한 레이아웃을 제공
// 관련 파일: components/dashboard/sidebar.tsx, components/dashboard/header.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  // 임시로 인증을 우회하여 메모 기능 테스트
  const mockUser = {
    id: 'test-user-123',
    email: 'test@example.com'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <Sidebar userEmail={mockUser.email} />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader userEmail={mockUser.email} />
        
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
