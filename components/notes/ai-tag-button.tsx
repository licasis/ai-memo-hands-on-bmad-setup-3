// components/notes/ai-tag-button.tsx
// AI 태그 생성 버튼 컴포넌트
// 노트 내용을 AI로 분석하여 태그를 생성하는 기능을 제공하는 버튼 컴포넌트
// 관련 파일: components/notes/tag-modal.tsx, app/api/ai/generate-tags/route.ts

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag, Settings } from 'lucide-react';
import { TagModal } from './tag-modal';
import { TagSettings } from './tag-settings';
import { AIStatusState } from '@/lib/ai/types';
import { AIStatusIndicator as StatusIndicator } from '@/components/ui/ai-status-indicator';

interface AITagButtonProps {
  noteId: string;
  noteTitle: string;
  noteContent: string;
}

interface TagSettings {
  maxTags: number;
  language: 'ko' | 'en' | 'both';
  autoApply: boolean;
}

export function AITagButton({ noteId: _noteId, noteTitle, noteContent }: AITagButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [settings, setSettings] = useState<TagSettings>({
    maxTags: 6,
    language: 'both',
    autoApply: false,
  });
  const [status, setStatus] = useState<AIStatusState>({
    status: 'idle',
    message: 'AI 태그를 생성할 수 있습니다',
  });

  const handleGenerateTags = async () => {
    if (!noteContent.trim()) {
      setStatus({
        status: 'error',
        message: '태그를 생성할 내용이 없습니다.',
        error: '태그를 생성할 내용이 없습니다.',
      });
      return;
    }

    setStatus({
      status: 'loading',
      message: 'AI가 태그를 생성하고 있습니다...',
      progress: 0,
    });
    setTags([]);

    try {
      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + 15, 90),
        }));
      }, 200);

      const response = await fetch('/api/ai/generate-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: noteContent,
          maxTags: settings.maxTags,
          language: settings.language,
        }),
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '태그 생성에 실패했습니다.');
      }

      setStatus({
        status: 'success',
        message: '태그가 성공적으로 생성되었습니다.',
        progress: 100,
      });
      setTags(data.tags || []);
      setShowModal(true);

      // 3초 후 상태 초기화
      setTimeout(() => {
        setStatus({
          status: 'idle',
          message: 'AI 태그를 생성할 수 있습니다',
        });
      }, 3000);
    } catch (error) {
      console.error('태그 생성 오류:', error);
      setStatus({
        status: 'error',
        message: '태그 생성에 실패했습니다.',
        error: error instanceof Error ? error.message : '태그 생성 중 오류가 발생했습니다.',
      });
    }
  };

  const handleRegenerate = () => {
    setTags([]);
    setStatus({
      status: 'idle',
      message: 'AI 태그를 생성할 수 있습니다',
    });
    handleGenerateTags();
  };

  const handleApplyTags = (selectedTags: string[]) => {
    // TODO: 선택된 태그를 노트에 적용하는 로직 구현
    console.log('적용할 태그:', selectedTags);
    setShowModal(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <Button
            onClick={handleGenerateTags}
            disabled={status.status === 'loading' || !noteContent.trim()}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            AI 태그
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
          aria-label="태그 설정"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {showModal && (
        <TagModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          tags={tags}
          error={status.status === 'error' ? status.error || null : null}
          noteTitle={noteTitle}
          onRegenerate={handleRegenerate}
          onApplyTags={handleApplyTags}
          isRegenerating={status.status === 'loading'}
        />
      )}

      {showSettings && (
        <TagSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSettingsChange={setSettings}
        />
      )}
    </>
  );
}
