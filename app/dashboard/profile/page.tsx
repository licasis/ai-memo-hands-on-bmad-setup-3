// app/dashboard/profile/page.tsx
// 프로필 페이지
// 사용자의 계정 정보와 프로필 설정을 관리하는 페이지
// 관련 파일: components/dashboard/profile-form.tsx, lib/supabase/server.ts

import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">프로필</h1>
          <p className="text-gray-600">
            계정 정보를 확인하고 프로필을 관리하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 프로필 정보 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">기본 정보</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value="user@example.com"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
                </div>

                <div>
                  <Label htmlFor="name">이름</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">자기소개</Label>
                  <textarea
                    id="bio"
                    placeholder="자기소개를 입력하세요"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button>변경사항 저장</Button>
              </div>
            </Card>
          </div>

          {/* 계정 정보 */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">계정 정보</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">가입일</p>
                    <p className="text-sm text-gray-600">2024년 1월 1일</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">계정 상태</p>
                    <p className="text-sm text-green-600">활성</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">위험 구역</h3>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                계정 삭제
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
