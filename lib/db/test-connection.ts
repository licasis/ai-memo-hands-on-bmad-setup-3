// lib/db/test-connection.ts
// 데이터베이스 연결 테스트 함수
// Drizzle ORM과 Supabase Postgres 간의 연결을 검증

import { db } from './index';

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // 간단한 쿼리로 연결 테스트
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ 데이터베이스 연결 성공:', result);
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    return false;
  }
}

// 직접 실행 시 테스트 수행
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('테스트 실행 중 오류:', error);
      process.exit(1);
    });
}
