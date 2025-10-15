// components/notes/tag-modal.tsx
// AI 태그 결과 표시 모달 컴포넌트
// 태그 결과를 모달 형태로 표시하고 편집, 적용 기능을 제공하는 컴포넌트
// 관련 파일: components/notes/ai-tag-button.tsx, components/ui/dialog.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, X, Check, Plus, Trash2 } from 'lucide-react';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  error: string | null;
  noteTitle: string;
  onRegenerate: () => void;
  onApplyTags: (tags: string[]) => void;
  isRegenerating: boolean;
}

export function TagModal({
  isOpen,
  onClose,
  tags,
  error,
  noteTitle,
  onRegenerate,
  onApplyTags,
  isRegenerating,
}: TagModalProps) {
  const [editableTags, setEditableTags] = useState<string[]>(tags);
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 태그가 변경될 때마다 편집 가능한 태그 목록 업데이트
  useState(() => {
    setEditableTags(tags);
    setSelectedTags(tags);
  }, [tags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleTagEdit = (oldTag: string, newTag: string) => {
    if (!newTag.trim()) return;
    
    setEditableTags(prev => 
      prev.map(tag => tag === oldTag ? newTag.trim() : tag)
    );
    
    setSelectedTags(prev => 
      prev.map(tag => tag === oldTag ? newTag.trim() : tag)
    );
  };

  const handleTagDelete = (tagToDelete: string) => {
    setEditableTags(prev => prev.filter(tag => tag !== tagToDelete));
    setSelectedTags(prev => prev.filter(tag => tag !== tagToDelete));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const trimmedTag = newTag.trim();
    if (!editableTags.includes(trimmedTag)) {
      setEditableTags(prev => [...prev, trimmedTag]);
      setSelectedTags(prev => [...prev, trimmedTag]);
    }
    setNewTag('');
  };

  const handleApply = () => {
    onApplyTags(selectedTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>AI 태그 생성</span>
            <span className="text-sm font-normal text-muted-foreground">
              - {noteTitle}
            </span>
          </DialogTitle>
          <DialogDescription>
            AI가 생성한 태그입니다. 편집하거나 선택하여 노트에 적용할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <X className="w-4 h-4" />
                <span className="font-medium">태그 생성 실패</span>
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
          ) : (
            <div className="space-y-4">
              {/* 생성된 태그 목록 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">생성된 태그</h4>
                <div className="flex flex-wrap gap-2">
                  {editableTags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Badge
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleTagDelete(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 태그 추가 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">태그 추가</h4>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="새 태그 입력"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    size="sm"
                    className="inline-flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </Button>
                </div>
              </div>

              {/* 선택된 태그 정보 */}
              <div className="text-sm text-muted-foreground">
                {selectedTags.length}개 태그 선택됨
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={onRegenerate}
            disabled={isRegenerating}
            variant="outline"
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
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              onClick={handleApply} 
              disabled={selectedTags.length === 0}
              className="inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              적용하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
