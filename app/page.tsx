// app/page.tsx
// 메인 페이지
// middleware에 의해 자동으로 로그인 페이지로 리다이렉트됨

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">AI 메모장</h1>
        <p className="text-gray-600">로그인 페이지로 이동합니다...</p>
      </div>
    </div>
  );
}
