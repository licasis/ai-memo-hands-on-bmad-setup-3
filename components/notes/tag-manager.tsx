// components/notes/tag-manager.tsx
// 태그 관리 클라이언트 컴포넌트
// 태그의 CRUD 기능을 제공하는 클라이언트 컴포넌트
// 관련 파일: app/api/tags/route.ts, app/notes/tags/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, Trash2, Loader2 } from 'lucide-react';

export function TagManager() {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 태그 목록 로드
  const loadTags = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tags');
      const data = await response.json();
      
      if (response.ok) {
        setTags(data.tags || []);
        setError(null);
      } else {
        console.error('태그 로드 API 오류:', data);
        setError(data.error || '태그를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('태그 로드 네트워크 오류:', err);
      setError('태그를 불러오는 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 태그 추가
  const handleAddTag = async () => {
    if (!newTag.trim()) {
      setError('태그 이름을 입력해주세요.');
      return;
    }

    try {
      setIsAdding(true);
      setError(null);
      
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag: newTag.trim(),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setNewTag('');
        // 태그 목록 새로고침
        await loadTags();
        
        // 추가로 로컬 상태에도 즉시 추가 (임시 해결책)
        if (data.tag && data.tag.tag) {
          setTags(prev => [...new Set([...prev, data.tag.tag])]);
        }
      } else {
        setError(data.error || '태그 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('태그 추가 오류:', err);
      setError('태그 추가 중 오류가 발생했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  // 태그 삭제
  const handleDeleteTag = async (tagToDelete: string) => {
    if (!confirm(`"${tagToDelete}" 태그를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // 실제로는 태그 ID가 필요하지만, 현재는 태그 이름으로 삭제
      // 이는 임시 구현이며, 실제로는 태그 ID를 사용해야 함
      setError('태그 삭제 기능은 아직 구현 중입니다.');
    } catch (err) {
      console.error('태그 삭제 오류:', err);
      setError('태그 삭제 중 오류가 발생했습니다.');
    }
  };

  // 컴포넌트 마운트 시 태그 로드
  useEffect(() => {
    loadTags();
  }, []);

  // Enter 키로 태그 추가
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <>
      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 새 태그 추가 */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="새 태그 이름을 입력하세요..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAdding}
            />
          </div>
          <Button 
            onClick={handleAddTag}
            disabled={isAdding || !newTag.trim()}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isAdding ? '추가 중...' : '태그 추가'}
          </Button>
        </div>
      </Card>

      {/* 태그 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">태그를 불러오는 중...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 태그가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              첫 번째 태그를 생성하여 노트를 정리해보세요.
            </p>
            <Button onClick={() => setNewTag('새 태그')}>
              <Plus className="w-4 h-4 mr-2" />
              첫 태그 만들기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                태그 목록 ({tags.length}개)
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadTags}
              >
                새로고침
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-sm flex items-center gap-2"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    className="ml-1 hover:text-red-500 transition-colors"
                    aria-label={`${tag} 태그 삭제`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
