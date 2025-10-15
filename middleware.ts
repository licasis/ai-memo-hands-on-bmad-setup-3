// middleware.ts
// 미들웨어 - 메인 페이지 접근 시 로그인 페이지로 리다이렉트

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 루트 경로 접근 시 로그인 페이지로 리다이렉트
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
