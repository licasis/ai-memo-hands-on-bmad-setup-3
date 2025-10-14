// components/auth/forgot-password-form.tsx
// 비밀번호 재설정 요청 폼 컴포넌트
// 이메일을 입력하여 비밀번호 재설정 요청을 처리합니다
// 관련 파일: app/auth/forgot-password/page.tsx, app/auth/forgot-password/actions.ts

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { forgotPasswordAction } from '@/app/auth/forgot-password/actions'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await forgotPasswordAction({ email })
      
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || '비밀번호 재설정 요청 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('비밀번호 재설정 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>이메일을 확인하세요</CardTitle>
          <CardDescription>
            비밀번호 재설정 링크를 {email}로 발송했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            이메일을 확인하고 링크를 클릭하여 새 비밀번호를 설정하세요.
          </p>
          <Button 
            onClick={() => {
              setSuccess(false)
              setEmail('')
            }}
            variant="outline"
            className="w-full"
          >
            다시 시도
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>비밀번호 재설정</CardTitle>
        <CardDescription>
          이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
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
            {isLoading ? '요청 중...' : '비밀번호 재설정 링크 보내기'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
