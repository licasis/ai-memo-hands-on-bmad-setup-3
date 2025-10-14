// app/dashboard/stats/page.tsx
// 통계 페이지
// 사용자의 노트 작성 통계와 분석을 보여주는 페이지
// 관련 파일: lib/db/queries/notes.ts, components/dashboard/stats-charts.tsx

import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { Card } from '@/components/ui/card';
import { BarChart3, FileText, Calendar, TrendingUp } from 'lucide-react';

export default function StatsPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">통계</h1>
          <p className="text-gray-600">
            노트 작성 활동과 통계를 확인하세요.
          </p>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 노트 수</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">이번 주 작성</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 길이</p>
                <p className="text-2xl font-bold text-gray-900">0자</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성도</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 작성 현황</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              차트가 여기에 표시됩니다
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">태그별 분포</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              차트가 여기에 표시됩니다
            </div>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
