# AI 메모장 프로젝트

AI 기반 메모장 애플리케이션입니다. MCP (Model Context Protocol)를 통합하여 다양한 AI 기능을 제공합니다.

## 🚀 주요 기능

- **메모장 관리**: 노트 생성, 편집, 검색
- **AI 통합**: MCP를 통한 AI 도구 지원
- **QR 코드**: 각 페이지의 공유용 QR 코드
- **실시간 동기화**: 자동 저장 및 실시간 업데이트

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **AI**: MCP (Model Context Protocol), Google Gemini
- **Database**: Drizzle ORM

## 📦 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# MCP 서버 실행 (별도 터미널)
pnpm mcp:greeting
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
