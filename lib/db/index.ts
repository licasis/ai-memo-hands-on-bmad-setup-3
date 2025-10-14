// lib/db/index.ts
// Drizzle ORM 데이터베이스 연결 설정
// Supabase Postgres와의 연결을 담당하며, 클라이언트와 서버에서 사용

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../drizzle/schema';

// 환경 변수에서 데이터베이스 URL 가져오기
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Postgres 클라이언트 생성
const client = postgres(connectionString, {
  prepare: false, // Supabase와의 호환성을 위해 false로 설정
  connect_timeout: 30, // 연결 타임아웃 30초
  idle_timeout: 20, // 유휴 타임아웃 20초
  max_lifetime: 60 * 30, // 최대 연결 시간 30분
});

// Drizzle 인스턴스 생성
export const db = drizzle(client, { schema });

// 스키마 내보내기 (타입 안전성을 위해)
export * from '../../drizzle/schema';

// 타입 정의 내보내기
export * from './types';

// 쿼리 함수들 내보내기
export * from './queries/notes';
export * from './queries/tags';
export * from './queries/summaries';

// 연결 테스트 함수 내보내기
export { testDatabaseConnection } from './test-connection';
