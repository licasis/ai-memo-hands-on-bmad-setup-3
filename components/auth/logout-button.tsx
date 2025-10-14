// components/auth/logout-button.tsx
// 로그아웃 버튼 컴포넌트
// 사용자가 로그아웃할 수 있는 버튼을 제공합니다
// 관련 파일: app/auth/logout/actions.ts, components/dashboard/header.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/app/auth/logout/actions'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function LogoutButton({ 
  className, 
  variant = 'outline',
  size = 'default' 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await logoutAction()
      
      if (result.success) {
        // 로그아웃 성공 시 로그인 페이지로 리다이렉트
        router.push('/auth/login')
      } else {
        setError(result.error || '로그아웃 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Button 
        onClick={handleLogout}
        variant={variant}
        size={size}
        className={className}
        disabled={isLoading}
      >
        {isLoading ? '로그아웃 중...' : '로그아웃'}
      </Button>
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  )
}
