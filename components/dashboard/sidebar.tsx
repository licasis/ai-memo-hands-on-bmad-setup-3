// components/dashboard/sidebar.tsx
// 대시보드 사이드바 컴포넌트
// 로그인한 사용자가 접근할 수 있는 주요 기능들에 대한 네비게이션 링크 제공
// 관련 파일: app/dashboard/page.tsx, components/dashboard/header.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  Plus, 
  Settings, 
  LogOut,
  User,
  Search,
  Tag,
  BarChart3,
  Clock
} from 'lucide-react';

interface SidebarProps {
  userEmail: string;
}

const navigationItems = [
  {
    name: '대시보드',
    href: '/dashboard',
    icon: Home,
    description: '메인 대시보드'
  },
  {
    name: '모든 노트',
    href: '/notes',
    icon: FileText,
    description: '작성한 모든 노트 보기'
  },
  {
    name: '최근 조회',
    href: '/notes/recent',
    icon: Clock,
    description: '최근 조회한 노트 보기'
  },
  {
    name: '새 노트 작성',
    href: '/notes/create',
    icon: Plus,
    description: '새로운 노트 작성'
  },
  {
    name: '노트 검색',
    href: '/notes/search',
    icon: Search,
    description: '노트 검색 및 필터링'
  },
  {
    name: '태그 관리',
    href: '/notes/tags',
    icon: Tag,
    description: '태그 관리 및 정리'
  },
  {
    name: '통계',
    href: '/dashboard/stats',
    icon: BarChart3,
    description: '작성 통계 및 분석'
  },
  {
    name: '프로필',
    href: '/dashboard/profile',
    icon: User,
    description: '계정 정보 및 설정'
  },
  {
    name: '설정',
    href: '/dashboard/settings',
    icon: Settings,
    description: '앱 설정 및 환경설정'
  }
];

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      {/* 사용자 정보 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userEmail}
            </p>
            <p className="text-xs text-gray-500">온라인</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'w-5 h-5',
                isActive ? 'text-blue-700' : 'text-gray-400'
              )} />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 하단 로그아웃 버튼 */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/auth/logout"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>로그아웃</span>
        </Link>
      </div>
    </div>
  );
}
