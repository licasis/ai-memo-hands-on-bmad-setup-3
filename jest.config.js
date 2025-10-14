// jest.config.js
// Jest 테스트 설정 파일
// React 컴포넌트와 Next.js 앱을 테스트하기 위한 설정입니다
// 관련 파일: __tests__/auth/signup.test.tsx, package.json

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공합니다
  dir: './',
})

// Jest에 전달할 사용자 정의 설정
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

// createJestConfig는 next/jest가 비동기적으로 Next.js 설정을 로드할 수 있도록 하는 내보내기입니다
module.exports = createJestConfig(customJestConfig)
