// components/ui/ai-status-indicator.tsx
// AI 상태 표시 통합 컴포넌트
// AI 처리 상태를 통합적으로 표시하는 컴포넌트
// 관련 파일: components/notes/ai-summary-button.tsx, components/notes/ai-tag-button.tsx

'use client';

import { AIStatusState, AI_STATUS_MESSAGES, AI_STATUS_COLORS, AI_STATUS_BG_COLORS } from '@/lib/ai/types';
import { LoadingSpinner } from './loading-spinner';
import { SuccessIndicator } from './success-indicator';
import { ErrorIndicator } from './error-indicator';
import { ProgressBar } from './progress-bar';
import { cn } from '@/lib/utils';

interface AIStatusIndicatorProps {
  status: AIStatusState;
  className?: string;
  showProgress?: boolean;
  showMessage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'card' | 'minimal';
}

export function AIStatusIndicator({
  status,
  className,
  showProgress = false,
  showMessage = true,
  size = 'md',
  variant = 'inline'
}: AIStatusIndicatorProps) {
  const { status: currentStatus, message, progress, error } = status;
  
  const getStatusMessage = () => {
    if (message) return message;
    return AI_STATUS_MESSAGES[currentStatus];
  };

  const getStatusColor = () => {
    return AI_STATUS_COLORS[currentStatus];
  };

  const getStatusBgColor = () => {
    return AI_STATUS_BG_COLORS[currentStatus];
  };

  const renderStatusIcon = () => {
    switch (currentStatus) {
      case 'loading':
        return (
          <LoadingSpinner
            size={size}
            message={showMessage ? getStatusMessage() : undefined}
            showMessage={showMessage}
          />
        );
      case 'success':
        return (
          <SuccessIndicator
            size={size}
            message={showMessage ? getStatusMessage() : undefined}
            showMessage={showMessage}
          />
        );
      case 'error':
        return (
          <ErrorIndicator
            size={size}
            message={showMessage ? (error || getStatusMessage()) : undefined}
            showMessage={showMessage}
          />
        );
      default:
        return null;
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center', className)}>
        {renderStatusIcon()}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'p-4 rounded-lg border transition-all duration-300',
        getStatusBgColor(),
        className
      )}>
        <div className="flex items-center gap-3">
          {renderStatusIcon()}
          {showProgress && progress !== undefined && (
            <div className="flex-1">
              <ProgressBar
                value={progress}
                size="sm"
                variant={currentStatus === 'error' ? 'error' : 'default'}
                animated={currentStatus === 'loading'}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // inline variant (default)
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {renderStatusIcon()}
      {showProgress && progress !== undefined && (
        <div className="flex-1 min-w-0">
          <ProgressBar
            value={progress}
            size="sm"
            variant={currentStatus === 'error' ? 'error' : 'default'}
            animated={currentStatus === 'loading'}
            showLabel={false}
          />
        </div>
      )}
    </div>
  );
}

export function AIStatusBadge({
  status,
  className
}: {
  status: AIStatusState;
  className?: string;
}) {
  const { status: currentStatus, message } = status;
  
  const getStatusMessage = () => {
    if (message) return message;
    return AI_STATUS_MESSAGES[currentStatus];
  };

  const getStatusBgColor = () => {
    return AI_STATUS_BG_COLORS[currentStatus];
  };

  const getStatusColor = () => {
    return AI_STATUS_COLORS[currentStatus];
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
      getStatusBgColor(),
      getStatusColor(),
      className
    )}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
      {getStatusMessage()}
    </div>
  );
}

export function AIStatusToast({
  status,
  onClose,
  className
}: {
  status: AIStatusState;
  onClose?: () => void;
  className?: string;
}) {
  const { status: currentStatus, message, error } = status;
  
  const getStatusMessage = () => {
    if (message) return message;
    return AI_STATUS_MESSAGES[currentStatus];
  };

  const getStatusBgColor = () => {
    return AI_STATUS_BG_COLORS[currentStatus];
  };

  const getStatusColor = () => {
    return AI_STATUS_COLORS[currentStatus];
  };

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 animate-in slide-in-from-right-2',
      getStatusBgColor(),
      className
    )}>
      <div className="flex items-center gap-3">
        <AIStatusIndicator
          status={status}
          size="sm"
          variant="minimal"
        />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', getStatusColor())}>
            {getStatusMessage()}
          </p>
          {error && currentStatus === 'error' && (
            <p className="text-xs text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
