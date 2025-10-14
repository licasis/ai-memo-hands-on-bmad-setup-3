// components/notes/summary-modal.tsx
// AI 요약 결과 표시 모달 컴포넌트
// 요약 결과를 모달 형태로 표시하고 복사, 재생성 기능을 제공하는 컴포넌트
// 관련 파일: components/notes/ai-summary-button.tsx, components/ui/dialog.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, RefreshCw, X, Check } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string | null;
  error: string | null;
  noteTitle: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function SummaryModal({
  isOpen,
  onClose,
  summary,
  error,
  noteTitle,
  onRegenerate,
  isRegenerating,
}: SummaryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const formatSummary = (text: string) => {
    // 불릿 포인트로 포맷팅
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        return trimmed;
      }
      return `• ${trimmed}`;
    }).join('\n');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>AI 요약</span>
            <span className="text-sm font-normal text-muted-foreground">
              - {noteTitle}
            </span>
          </DialogTitle>
          <DialogDescription>
            AI가 생성한 노트 요약입니다. 복사하거나 재생성할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <X className="w-4 h-4" />
                <span className="font-medium">요약 생성 실패</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
              <Button
                onClick={onRegenerate}
                disabled={isRegenerating}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    재생성 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    다시 시도
                  </>
                )}
              </Button>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {formatSummary(summary)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {summary.length}자 • {summary.split('\n').filter(line => line.trim()).length}개 포인트
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        복사
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2"
                  >
                    {isRegenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        재생성 중...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        재생성
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
