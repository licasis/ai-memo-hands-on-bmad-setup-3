// components/notes/ai-summary-button.tsx
// AI 요약 생성 버튼 컴포넌트
// 노트 내용을 AI로 요약하는 기능을 제공하는 버튼 컴포넌트
// 관련 파일: components/notes/summary-modal.tsx, app/api/ai/summarize/route.ts

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Settings } from 'lucide-react';
import { SummaryModal } from './summary-modal';
import { SummarySettings } from './summary-settings';

interface AISummaryButtonProps {
  noteId: string;
  noteTitle: string;
  noteContent: string;
}

interface SummarySettings {
  maxLength: number;
  style: 'bullet' | 'paragraph';
  temperature: number;
  autoGenerate: boolean;
}

export function AISummaryButton({ noteId, noteTitle, noteContent }: AISummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SummarySettings>({
    maxLength: 300,
    style: 'bullet',
    temperature: 0.7,
    autoGenerate: false,
  });

  const handleGenerateSummary = async () => {
    if (!noteContent.trim()) {
      setError('요약할 내용이 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: noteContent,
          maxLength: settings.maxLength,
          temperature: settings.temperature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '요약 생성에 실패했습니다.');
      }

      setSummary(data.summary);
      setShowModal(true);
    } catch (error) {
      console.error('요약 생성 오류:', error);
      setError(error instanceof Error ? error.message : '요약 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setSummary(null);
    setError(null);
    handleGenerateSummary();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleGenerateSummary}
          disabled={isLoading || !noteContent.trim()}
          variant="outline"
          className="inline-flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isLoading ? '요약 생성 중...' : 'AI 요약'}
        </Button>
        
        <Button
          onClick={() => setShowSettings(true)}
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-2"
          aria-label="요약 설정"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {showModal && (
        <SummaryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          summary={summary}
          error={error}
          noteTitle={noteTitle}
          onRegenerate={handleRegenerate}
          isRegenerating={isLoading}
        />
      )}

      {showSettings && (
        <SummarySettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSettingsChange={setSettings}
        />
      )}
    </>
  );
}
