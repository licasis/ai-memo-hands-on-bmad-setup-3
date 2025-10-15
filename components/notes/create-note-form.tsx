// components/notes/create-note-form.tsx
// 노트 생성 폼 컴포넌트
// 사용자가 제목과 본문을 입력하여 새로운 노트를 생성할 수 있는 폼
// 관련 파일: app/notes/create/page.tsx, app/notes/create/actions.ts

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { createNote } from '@/app/notes/create/actions';

// 폼 유효성 검사 스키마
const createNoteSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(255, '제목은 255자 이하로 입력해주세요'),
  content: z.string().min(1, '본문을 입력해주세요'),
});

type CreateNoteFormData = z.infer<typeof createNoteSchema>;

export default function CreateNoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateNoteFormData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const watchedContent = watch('content');

  // 리치 텍스트 에디터 변경 핸들러
  const handleContentChange = (value: string) => {
    setContent(value);
    setValue('content', value);
  };

  const onSubmit = async (data: CreateNoteFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createNote(data);
      
      if (result.success) {
        reset();
        setContent('');
        router.push('/notes');
      } else {
        setError(result.error || '노트 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('예상치 못한 오류가 발생했습니다.');
      console.error('노트 생성 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="노트 제목을 입력하세요"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">본문 *</Label>
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            placeholder="노트 내용을 입력하세요. 다양한 서식을 적용할 수 있습니다."
            disabled={isSubmitting}
            height={300}
            className="w-full"
          />
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/notes')}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? '저장 중...' : '노트 저장'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
