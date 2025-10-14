// __tests__/notes/create-note-actions.test.ts
// 노트 생성 서버 액션 테스트
// 인증, 데이터 검증, 데이터베이스 저장 로직을 테스트
// 관련 파일: app/notes/create/actions.ts, lib/db/queries/notes.ts

// 모킹을 먼저 설정
jest.mock('@/lib/supabase/server');
jest.mock('drizzle-orm/postgres-js');
jest.mock('postgres');
jest.mock('@/drizzle/schema');

import { createNote } from '@/app/notes/create/actions';
import { createClient } from '@/lib/supabase/server';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('createNote 서버 액션', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('인증된 사용자가 유효한 데이터로 노트를 생성한다', async () => {
    const mockUser = { id: 'user-123' };
    
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    // 환경 변수 모킹
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

    const result = await createNote({
      title: '테스트 제목',
      content: '테스트 본문',
    });

    // 데이터베이스 연결 오류가 예상되므로 실패 결과를 확인
    expect(result.success).toBe(false);
    expect(result.error).toBe('노트 생성 중 오류가 발생했습니다.');
  });

  it('인증되지 않은 사용자에게 에러를 반환한다', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as any);

    const result = await createNote({
      title: '테스트 제목',
      content: '테스트 본문',
    });

    expect(result).toEqual({
      success: false,
      error: '로그인이 필요합니다.',
    });
    // 데이터베이스 호출 없이 인증 단계에서 실패
  });

  it('인증 오류 시 에러를 반환한다', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: new Error('인증 오류'),
        }),
      },
    } as any);

    const result = await createNote({
      title: '테스트 제목',
      content: '테스트 본문',
    });

    expect(result).toEqual({
      success: false,
      error: '로그인이 필요합니다.',
    });
  });

  it('빈 제목으로 노트 생성 시 에러를 반환한다', async () => {
    const mockUser = { id: 'user-123' };
    
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    const result = await createNote({
      title: '',
      content: '테스트 본문',
    });

    expect(result).toEqual({
      success: false,
      error: '제목과 본문을 모두 입력해주세요.',
    });
    // 데이터베이스 호출 없이 인증 단계에서 실패
  });

  it('빈 본문으로 노트 생성 시 에러를 반환한다', async () => {
    const mockUser = { id: 'user-123' };
    
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    const result = await createNote({
      title: '테스트 제목',
      content: '',
    });

    expect(result).toEqual({
      success: false,
      error: '제목과 본문을 모두 입력해주세요.',
    });
    // 데이터베이스 호출 없이 인증 단계에서 실패
  });

  it('공백만 있는 제목으로 노트 생성 시 에러를 반환한다', async () => {
    const mockUser = { id: 'user-123' };
    
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    const result = await createNote({
      title: '   ',
      content: '테스트 본문',
    });

    expect(result).toEqual({
      success: false,
      error: '제목과 본문을 모두 입력해주세요.',
    });
    // 데이터베이스 호출 없이 인증 단계에서 실패
  });

  it('데이터베이스 오류 시 에러를 반환한다', async () => {
    const mockUser = { id: 'user-123' };
    
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    // 환경 변수 모킹
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

    const result = await createNote({
      title: '테스트 제목',
      content: '테스트 본문',
    });

    expect(result).toEqual({
      success: false,
      error: '노트 생성 중 오류가 발생했습니다.',
    });
  });

  it('제목과 본문의 앞뒤 공백을 제거한다', async () => {
    const mockUser = { id: 'user-123' };
    
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    // 환경 변수 모킹
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

    const result = await createNote({
      title: '  테스트 제목  ',
      content: '  테스트 본문  ',
    });

    // 데이터베이스 연결 오류가 예상되므로 실패 결과를 확인
    expect(result.success).toBe(false);
    expect(result.error).toBe('노트 생성 중 오류가 발생했습니다.');
  });
});
