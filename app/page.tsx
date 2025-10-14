// app/page.tsx
// 메인 페이지
// 인증된 사용자는 대시보드로, 미인증 사용자는 로그인 페이지로 리다이렉트합니다
// 관련 파일: app/dashboard/page.tsx, app/auth/login/page.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  
  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // 인증된 사용자는 대시보드로 리다이렉트
    redirect('/dashboard')
  } else {
    // 미인증 사용자는 로그인 페이지로 리다이렉트
    redirect('/auth/login')
  }
}
