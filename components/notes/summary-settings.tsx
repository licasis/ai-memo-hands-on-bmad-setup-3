// components/notes/summary-settings.tsx
// 요약 설정 다이얼로그 컴포넌트
// 사용자가 요약 생성 옵션을 설정할 수 있는 다이얼로그 컴포넌트
// 관련 파일: app/api/ai/summary-settings/route.ts, components/notes/ai-summary-button.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save } from 'lucide-react';

interface SummarySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: SummarySettings) => void;
}

interface SummarySettings {
  maxLength: number;
  style: 'bullet' | 'paragraph';
  temperature: number;
  autoGenerate: boolean;
}

export function SummarySettings({ isOpen, onClose, onSettingsChange }: SummarySettingsProps) {
  const [settings, setSettings] = useState<SummarySettings>({
    maxLength: 300,
    style: 'bullet',
    temperature: 0.7,
    autoGenerate: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/summary-settings');
      const data = await response.json();
      
      if (response.ok) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('설정 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/ai/summary-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (response.ok) {
        onSettingsChange(settings);
        onClose();
      } else {
        console.error('설정 저장 실패:', data.error);
      }
    } catch (error) {
      console.error('설정 저장 오류:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMaxLengthChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setSettings(prev => ({ ...prev, maxLength: Math.max(50, Math.min(1000, numValue)) }));
    }
  };

  const handleTemperatureChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSettings(prev => ({ ...prev, temperature: Math.max(0, Math.min(1, numValue)) }));
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">설정을 불러오는 중...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>요약 설정</DialogTitle>
          <DialogDescription>
            AI 요약 생성 옵션을 설정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 최대 길이 */}
          <div className="space-y-2">
            <Label htmlFor="maxLength">최대 요약 길이</Label>
            <div className="flex items-center gap-2">
              <Input
                id="maxLength"
                type="number"
                value={settings.maxLength}
                onChange={(e) => handleMaxLengthChange(e.target.value)}
                min="50"
                max="1000"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">자</span>
            </div>
            <p className="text-xs text-muted-foreground">
              50-1000자 사이로 설정하세요
            </p>
          </div>

          {/* 스타일 */}
          <div className="space-y-2">
            <Label htmlFor="style">요약 스타일</Label>
            <Select
              value={settings.style}
              onValueChange={(value: 'bullet' | 'paragraph') => 
                setSettings(prev => ({ ...prev, style: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bullet">불릿 포인트</SelectItem>
                <SelectItem value="paragraph">문단 형태</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 온도 */}
          <div className="space-y-2">
            <Label htmlFor="temperature">창의성 수준</Label>
            <div className="flex items-center gap-2">
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleTemperatureChange(e.target.value)}
                min="0"
                max="1"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">0.0-1.0</span>
            </div>
            <p className="text-xs text-muted-foreground">
              낮을수록 일관성, 높을수록 창의성
            </p>
          </div>

          {/* 자동 생성 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoGenerate">자동 요약 생성</Label>
              <p className="text-xs text-muted-foreground">
                노트 저장 시 자동으로 요약을 생성합니다
              </p>
            </div>
            <Switch
              id="autoGenerate"
              checked={settings.autoGenerate}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, autoGenerate: checked }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                저장
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
