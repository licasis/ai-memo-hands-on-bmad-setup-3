// components/notes/ai-summary-button.tsx
// AI 요약 생성 버튼 컴포넌트
// 노트 내용을 AI로 요약하는 기능을 제공하는 버튼 컴포넌트
// 관련 파일: components/notes/summary-modal.tsx, app/api/ai/summarize/route.ts

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Settings } from 'lucide-react';
import { SummaryModal } from './summary-modal';
import { SummarySettings } from './summary-settings';
import { AIStatusState } from '@/lib/ai/types';
import { AIStatusIndicator as StatusIndicator } from '@/components/ui/ai-status-indicator';

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

export function AISummaryButton({ noteId: _noteId, noteTitle, noteContent }: AISummaryButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [settings, setSettings] = useState<SummarySettings>({
    maxLength: 300,
    style: 'bullet',
    temperature: 0.7,
    autoGenerate: false,
  });
  const [status, setStatus] = useState<AIStatusState>({
    status: 'idle',
    message: 'AI 요약을 생성할 수 있습니다',
  });

  const handleGenerateSummary = async () => {
    if (!noteContent.trim()) {
      setStatus({
        status: 'error',
        message: '요약할 내용이 없습니다.',
        error: '요약할 내용이 없습니다.',
      });
      return;
    }

    setStatus({
      status: 'loading',
      message: 'AI가 요약을 생성하고 있습니다...',
      progress: 0,
    });
    setSummary(null);

    try {
      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + 10, 90),
        }));
      }, 200);

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

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '요약 생성에 실패했습니다.');
      }

      setStatus({
        status: 'success',
        message: '요약이 성공적으로 생성되었습니다.',
        progress: 100,
      });
      setSummary(data.summary);
      setShowModal(true);

      // 3초 후 상태 초기화
      setTimeout(() => {
        setStatus({
          status: 'idle',
          message: 'AI 요약을 생성할 수 있습니다',
        });
      }, 3000);
    } catch (error) {
      console.error('요약 생성 오류:', error);
      setStatus({
        status: 'error',
        message: '요약 생성에 실패했습니다.',
        error: error instanceof Error ? error.message : '요약 생성 중 오류가 발생했습니다.',
      });
    }
  };

  const handleRegenerate = () => {
    setSummary(null);
    setStatus({
      status: 'idle',
      message: 'AI 요약을 생성할 수 있습니다',
    });
    handleGenerateSummary();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <Button
            onClick={handleGenerateSummary}
            disabled={status.status === 'loading' || !noteContent.trim()}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI 요약
          </Button>
          <StatusIndicator
            status={status}
            size="sm"
            variant="minimal"
            showMessage={true}
            showProgress={status.status === 'loading'}
          />
        </div>
        
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
          error={status.status === 'error' ? status.error || null : null}
          noteTitle={noteTitle}
          onRegenerate={handleRegenerate}
          isRegenerating={status.status === 'loading'}
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
