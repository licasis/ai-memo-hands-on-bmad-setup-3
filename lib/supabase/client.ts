// lib/supabase/client.ts
// Supabase 클라이언트 설정 파일
// 클라이언트 사이드에서 사용할 Supabase 클라이언트를 생성합니다
// 관련 파일: lib/supabase/server.ts, app/auth/signup/actions.ts

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
