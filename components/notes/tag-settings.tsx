// components/notes/tag-settings.tsx
// 태그 설정 다이얼로그 컴포넌트
// 사용자가 태그 생성 옵션을 설정할 수 있는 다이얼로그 컴포넌트
// 관련 파일: app/api/ai/tag-settings/route.ts, components/notes/ai-tag-button.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save } from 'lucide-react';

interface TagSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: TagSettings) => void;
}

interface TagSettings {
  maxTags: number;
  language: 'ko' | 'en' | 'both';
  autoApply: boolean;
}

export function TagSettings({ isOpen, onClose, onSettingsChange }: TagSettingsProps) {
  const [settings, setSettings] = useState<TagSettings>({
    maxTags: 6,
    language: 'both',
    autoApply: false,
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
      const response = await fetch('/api/ai/tag-settings');
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
      const response = await fetch('/api/ai/tag-settings', {
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

  const handleMaxTagsChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setSettings(prev => ({ ...prev, maxTags: Math.max(1, Math.min(10, numValue)) }));
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
          <DialogTitle>태그 설정</DialogTitle>
          <DialogDescription>
            AI 태그 생성 옵션을 설정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 최대 태그 개수 */}
          <div className="space-y-2">
            <Label htmlFor="maxTags">최대 태그 개수</Label>
            <div className="flex items-center gap-2">
              <Input
                id="maxTags"
                type="number"
                value={settings.maxTags}
                onChange={(e) => handleMaxTagsChange(e.target.value)}
                min="1"
                max="10"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">개</span>
            </div>
            <p className="text-xs text-muted-foreground">
              1-10개 사이로 설정하세요
            </p>
          </div>

          {/* 언어 설정 */}
          <div className="space-y-2">
            <Label htmlFor="language">태그 언어</Label>
            <Select
              value={settings.language}
              onValueChange={(value: 'ko' | 'en' | 'both') => 
                setSettings(prev => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어만</SelectItem>
                <SelectItem value="en">영어만</SelectItem>
                <SelectItem value="both">한국어 + 영어</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 자동 적용 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoApply">자동 태그 적용</Label>
              <p className="text-xs text-muted-foreground">
                태그 생성 시 자동으로 노트에 적용합니다
              </p>
            </div>
            <Switch
              id="autoApply"
              checked={settings.autoApply}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, autoApply: checked }))
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
