// components/ui/color-picker.tsx
// 색상 선택 컴포넌트
// 텍스트 색상과 배경색을 선택할 수 있는 컴포넌트
// 관련 파일: components/ui/rich-text-editor.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Type, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  onTextColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  className?: string;
}

const textColors = [
  { name: '기본', value: '', class: 'text-gray-900' },
  { name: '빨강', value: 'red', class: 'text-red-600' },
  { name: '파랑', value: 'blue', class: 'text-blue-600' },
  { name: '초록', value: 'green', class: 'text-green-600' },
  { name: '노랑', value: 'yellow', class: 'text-yellow-600' },
  { name: '보라', value: 'purple', class: 'text-purple-600' },
  { name: '주황', value: 'orange', class: 'text-orange-600' },
  { name: '분홍', value: 'pink', class: 'text-pink-600' },
  { name: '회색', value: 'gray', class: 'text-gray-600' },
  { name: '검정', value: 'black', class: 'text-black' },
];

const backgroundColors = [
  { name: '기본', value: '', class: 'bg-transparent' },
  { name: '빨강', value: 'red', class: 'bg-red-100' },
  { name: '파랑', value: 'blue', class: 'bg-blue-100' },
  { name: '초록', value: 'green', class: 'bg-green-100' },
  { name: '노랑', value: 'yellow', class: 'bg-yellow-100' },
  { name: '보라', value: 'purple', class: 'bg-purple-100' },
  { name: '주황', value: 'orange', class: 'bg-orange-100' },
  { name: '분홍', value: 'pink', class: 'bg-pink-100' },
  { name: '회색', value: 'gray', class: 'bg-gray-100' },
  { name: '검정', value: 'black', class: 'bg-gray-800' },
];

export function ColorPicker({ onTextColorChange, onBackgroundColorChange, className }: ColorPickerProps) {
  const [textColor, setTextColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  const handleTextColorSelect = (color: string) => {
    setTextColor(color);
    onTextColorChange(color);
  };

  const handleBackgroundColorSelect = (color: string) => {
    setBackgroundColor(color);
    onBackgroundColorChange(color);
  };

  return (
    <div className={cn('flex gap-2', className)}>
      {/* 텍스트 색상 선택 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            텍스트 색상
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">텍스트 색상</h4>
            <div className="grid grid-cols-5 gap-2">
              {textColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleTextColorSelect(color.value)}
                  className={cn(
                    'p-2 rounded border text-xs hover:bg-gray-100 transition-colors',
                    color.class,
                    textColor === color.value && 'ring-2 ring-blue-500'
                  )}
                  title={color.name}
                >
                  A
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 배경색 선택 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            배경색
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">배경색</h4>
            <div className="grid grid-cols-5 gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleBackgroundColorSelect(color.value)}
                  className={cn(
                    'p-2 rounded border text-xs hover:bg-gray-100 transition-colors',
                    color.class,
                    backgroundColor === color.value && 'ring-2 ring-blue-500'
                  )}
                  title={color.name}
                >
                  A
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
