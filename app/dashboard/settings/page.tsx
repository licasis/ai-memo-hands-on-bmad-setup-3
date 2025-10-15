// app/dashboard/settings/page.tsx
// 설정 페이지
// 앱 설정과 환경설정을 관리하는 페이지
// 관련 파일: components/dashboard/settings-form.tsx, lib/supabase/server.ts

import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">설정</h1>
          <p className="text-gray-600">
            앱 설정과 환경설정을 관리하세요.
          </p>
        </div>

        <div className="space-y-6">
          {/* 일반 설정 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">일반 설정</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">자동 저장</Label>
                  <p className="text-sm text-gray-500">노트 작성 중 자동으로 저장합니다</p>
                </div>
                <Switch id="auto-save" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">다크 모드</Label>
                  <p className="text-sm text-gray-500">어두운 테마를 사용합니다</p>
                </div>
                <Switch id="dark-mode" />
              </div>
            </div>
          </Card>

          {/* 알림 설정 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">이메일 알림</Label>
                  <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">푸시 알림</Label>
                  <p className="text-sm text-gray-500">브라우저 푸시 알림을 받습니다</p>
                </div>
                <Switch id="push-notifications" />
              </div>
            </div>
          </Card>

          {/* 보안 설정 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">보안 설정</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="session-timeout">세션 타임아웃</Label>
                <select
                  id="session-timeout"
                  defaultValue="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                >
                  <option value="30">30분</option>
                  <option value="60">1시간</option>
                  <option value="120">2시간</option>
                  <option value="480">8시간</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">2단계 인증</Label>
                  <p className="text-sm text-gray-500">추가 보안을 위해 2단계 인증을 사용합니다</p>
                </div>
                <Switch id="two-factor" />
              </div>
            </div>
          </Card>

          {/* 데이터 관리 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">데이터 관리</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>데이터 내보내기</Label>
                  <p className="text-sm text-gray-500">모든 노트를 JSON 파일로 내보냅니다</p>
                </div>
                <Button variant="outline">내보내기</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>데이터 가져오기</Label>
                  <p className="text-sm text-gray-500">JSON 파일에서 노트를 가져옵니다</p>
                </div>
                <Button variant="outline">가져오기</Button>
              </div>
            </div>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <Button size="lg">설정 저장</Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
