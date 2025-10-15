# MCP (Model Context Protocol) 통합

이 프로젝트는 Model Context Protocol을 통해 다양한 AI 도구와 외부 서비스를 통합합니다.

## 📋 개요

MCP는 AI 모델과 다양한 도구 및 데이터 소스 간의 표준화된 인터페이스를 제공하는 프로토콜입니다. 이를 통해 메모장 애플리케이션에서 AI 기반 기능을 쉽게 확장할 수 있습니다.

## 🏗️ 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   메모장 앱      │────│   MCP 클라이언트   │────│   MCP 서버들    │
│                 │    │                 │    │                 │
│ - 노트 편집기    │    │ - 도구 실행       │    │ - 노트 개선      │
│ - AI 도움 버튼   │    │ - 리소스 접근     │    │ - 태그 추천      │
│ - QR 코드 공유   │    │ - 프롬프트 관리   │    │ - 맞춤법 검사    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 주요 기능

### 1. 노트 내용 개선
- AI를 활용한 내용 품질 향상
- 문맥 이해 기반의 제안

### 2. 자동 요약 생성
- 긴 노트 내용을 간결하게 요약
- 다양한 스타일 지원 (글머리 기호, 문단 등)

### 3. 스마트 태그 추천
- 내용 분석 기반 태그 제안
- 기존 태그와의 중복 방지

### 4. 맞춤법 및 문법 검사
- 한국어 맞춤법 검사
- 문법 오류 수정 제안

### 5. 외부 정보 검색
- 웹 검색 통합
- 관련 정보 자동 수집

## 🛠️ 기술 스택

- **MCP SDK**: `@modelcontextprotocol/sdk`
- **클라이언트**: React 기반 커스텀 훅
- **서버**: Stdio 기반 MCP 서버들
- **UI**: QR 코드, 상태 표시기

## ⚙️ 설정

### 환경변수

```bash
# MCP 서버 활성화
MCP_NOTE_ENHANCER_ENABLED=true
MCP_TAG_SUGGESTER_ENABLED=true
MCP_GRAMMAR_CHECKER_ENABLED=true

# 타임아웃 및 재시도 설정
MCP_TIMEOUT=30000
MCP_RETRY_ATTEMPTS=3
MCP_LOG_LEVEL=info
```

### 기본 MCP 서버들

1. **note-enhancer**: 노트 내용 개선
2. **tag-suggester**: 태그 추천
3. **grammar-checker**: 맞춤법 검사
4. **search-enhancer**: 검색 쿼리 개선
5. **web-search**: 외부 정보 검색

## 🚀 사용 방법

### 1. 노트 편집기에서 AI 도움

```tsx
// 노트 에디터에 AI 버튼들이 자동으로 추가됩니다
<Button onClick={enhanceContentWithAI}>개선</Button>
<Button onClick={generateSummaryWithAI}>요약</Button>
<Button onClick={checkGrammarWithAI}>검사</Button>
```

### 2. MCP 상태 모니터링

```tsx
// 대시보드에 MCP 연결 상태 표시
<MCPStatus />
```

### 3. QR 코드 공유

```tsx
// 각 페이지의 QR 코드 자동 생성
<QRCode value={currentPageUrl} />
```

## 📊 상태 관리

MCP 클라이언트는 다음과 같은 상태를 관리합니다:

- **연결 상태**: 연결됨/연결 중/연결 안됨
- **사용 가능한 도구**: 로드된 MCP 도구 목록
- **활동 로그**: 도구 실행 및 리소스 접근 기록
- **오류 처리**: 자동 재시도 및 오류 복구

## 🔧 확장

새로운 MCP 서버를 추가하려면:

1. `lib/mcp/config.ts`에 서버 설정 추가
2. `lib/mcp/client.ts`에서 연결 로직 구현
3. 필요한 경우 새로운 React 컴포넌트 추가

## 📈 모니터링

- 실시간 연결 상태 표시
- 도구 실행 성능 모니터링
- 오류 로그 및 재시도 기록
- 리소스 사용량 추적

## 🔒 보안

- 서버 간 통신은 Stdio 파이프 사용
- 환경변수를 통한 민감한 설정 관리
- 타임아웃 및 재시도 제한으로 안정성 확보

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일 최적화
- **실시간 피드백**: 연결 상태 및 진행 상황 표시
- **직관적인 인터페이스**: AI 도움 버튼들
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
