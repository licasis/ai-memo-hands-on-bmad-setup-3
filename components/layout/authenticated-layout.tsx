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
  const supabase = await createClient();
  
  // 현재 로그인한 사용자 정보 가져오기
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // 사용자가 로그인하지 않았거나 오류가 발생한 경우 로그인 페이지로 리다이렉트
  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <Sidebar userEmail={user.email!} />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader userEmail={user.email!} />
        
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
