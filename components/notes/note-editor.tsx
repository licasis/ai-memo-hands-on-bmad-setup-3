// components/notes/note-editor.tsx
// 노트 편집기 컴포넌트
// 노트의 제목과 내용을 편집하고 실시간 저장 기능을 제공하는 컴포넌트
// 관련 파일: app/notes/[id]/edit/actions.ts, components/notes/auto-save-indicator.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ArrowLeft, Save, AlertCircle, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { AutoSaveIndicator } from './auto-save-indicator';
import { updateNote } from '@/app/notes/[id]/edit/actions';
// import { useMCP } from '@/lib/hooks/use-mcp';
// import { getMCPConfig } from '@/lib/mcp/config';

interface NoteEditorProps {
  note: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function NoteEditor({ note }: NoteEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // MCP 기능은 추후 서버 API로 구현 예정
  // 현재는 UI만 표시하고 실제 기능은 비활성화
  const isConnected = false;
  const isConnecting = false;

  // MCP AI 도움 함수들 (추후 서버 API로 구현 예정)
  const enhanceContentWithAI = useCallback(async () => {
    if (!content.trim()) return;
    // TODO: 서버 API로 AI 내용 개선 기능 구현
    alert('AI 내용 개선 기능은 추후 지원 예정입니다.');
  }, [content]);

  const generateSummaryWithAI = useCallback(async () => {
    if (!content.trim()) return;
    // TODO: 서버 API로 AI 요약 생성 기능 구현
    alert('AI 요약 생성 기능은 추후 지원 예정입니다.');
  }, [content]);

  const checkGrammarWithAI = useCallback(async () => {
    if (!content.trim()) return;
    // TODO: 서버 API로 AI 맞춤법 검사 기능 구현
    alert('AI 맞춤법 검사 기능은 추후 지원 예정입니다.');
  }, [content]);

  // 변경사항 감지
  useEffect(() => {
    const hasChanges = title !== note.title || content !== note.content;
    setHasUnsavedChanges(hasChanges);
  }, [title, content, note.title, note.content]);

  // 실시간 저장 (디바운스)
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (title: string, content: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (title !== note.title || content !== note.content) {
            await handleSave(title, content);
          }
        }, 2000); // 2초 후 자동 저장
      };
    })(),
    [note.title, note.content]
  );

  // 제목 변경 시 자동 저장
  useEffect(() => {
    if (hasUnsavedChanges) {
      debouncedSave(title, content);
    }
  }, [title, content, hasUnsavedChanges, debouncedSave]);

  const handleSave = async (titleToSave: string, contentToSave: string) => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await updateNote(note.id, {
        title: titleToSave,
        content: contentToSave,
      });

      if (result.success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } else {
        setSaveError(result.error || '저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('저장 오류:', error);
      setSaveError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    await handleSave(title, content);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('저장되지 않은 변경사항이 있습니다. 정말 나가시겠습니까?');
      if (!confirmed) return;
    }
    router.push(`/notes/${note.id}`);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
        
        <div className="flex items-center gap-3">
          {/* AI 도움 버튼들 */}
          <div className="flex items-center gap-2 mr-4">
            {/* MCP 연결 상태 표시 */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' :
                isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span>
                {isConnected ? 'AI 연결됨' :
                 isConnecting ? '연결 중...' : 'AI 연결 안됨'}
              </span>
            </div>

            {isConnected && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={enhanceContentWithAI}
                  disabled={!content.trim()}
                  className="inline-flex items-center gap-1"
                  title="AI로 내용 개선"
                >
                  <Sparkles className="w-3 h-3" />
                  개선
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSummaryWithAI}
                  disabled={!content.trim()}
                  className="inline-flex items-center gap-1"
                  title="AI로 요약 생성"
                >
                  <FileText className="w-3 h-3" />
                  요약
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkGrammarWithAI}
                  disabled={!content.trim()}
                  className="inline-flex items-center gap-1"
                  title="AI로 맞춤법 검사"
                >
                  <CheckCircle className="w-3 h-3" />
                  검사
                </Button>
              </>
            )}
          </div>

          <AutoSaveIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
            error={saveError}
          />
          <Button
            onClick={handleManualSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="inline-flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                저장
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 편집 폼 */}
      <Card>
        <CardHeader>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="노트 제목을 입력하세요..."
            className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
          />
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="노트 내용을 입력하세요. 다양한 서식을 적용할 수 있습니다."
            height={400}
            className="border-none"
          />
        </CardContent>
      </Card>

      {/* 에러 메시지 */}
      {saveError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{saveError}</span>
        </div>
      )}
    </div>
  );
}
