// components/auth/reset-password-form.tsx
// 비밀번호 재설정 폼 컴포넌트
// 새 비밀번호를 입력하여 비밀번호를 재설정합니다
// 관련 파일: app/auth/reset-password/page.tsx, app/auth/reset-password/actions.ts

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resetPasswordAction } from '@/app/auth/reset-password/actions'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const validateForm = () => {
    // 비밀번호 길이 검사
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return false
    }

    // 비밀번호 확인 검사
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPasswordAction({ password })
      
      if (result.success) {
        // 비밀번호 재설정 성공 시 로그인 페이지로 리다이렉트
        router.push('/auth/login?message=password-reset-success')
      } else {
        setError(result.error || '비밀번호 재설정 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('비밀번호 재설정 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>새 비밀번호 설정</CardTitle>
        <CardDescription>
          새 비밀번호를 입력하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">새 비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상의 비밀번호를 입력하세요"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? '재설정 중...' : '비밀번호 재설정'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
