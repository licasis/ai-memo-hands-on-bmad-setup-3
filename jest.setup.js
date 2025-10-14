// jest.setup.js
// Jest 테스트 설정 파일
// 테스트 환경에서 사용할 전역 설정을 정의합니다
// 관련 파일: jest.config.js, __tests__/auth/signup.test.tsx

import '@testing-library/jest-dom'

// Next.js router 모킹
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Supabase 클라이언트 모킹은 각 테스트 파일에서 개별적으로 처리

// 환경 변수 모킹
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
