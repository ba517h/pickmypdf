import React from 'react';
import { SaveStatus } from '@/lib/types';
import { Button } from './button';
import { Badge } from './badge';
import { Clock, Check, AlertCircle, Save, Loader2 } from 'lucide-react';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSavedAt: Date | null;
  onSave?: () => void;
  className?: string;
}

export function SaveStatusIndicator({ 
  status, 
  lastSavedAt, 
  onSave,
  className = '' 
}: SaveStatusIndicatorProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Saving...',
          variant: 'secondary' as const,
          className: 'animate-spin'
        };
      case 'saved':
        return {
          icon: Check,
          text: 'Saved',
          variant: 'default' as const,
          className: 'text-green-600'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Save Error',
          variant: 'destructive' as const,
          className: 'text-red-600'
        };
      default:
        return {
          icon: Clock,
          text: 'Unsaved',
          variant: 'outline' as const,
          className: 'text-yellow-600'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Badge */}
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${statusInfo.className}`} />
        <span className="text-xs">{statusInfo.text}</span>
      </Badge>

      {/* Last Saved Time */}
      {lastSavedAt && status === 'saved' && (
        <span className="text-xs text-muted-foreground">
          {formatLastSaved(lastSavedAt)}
        </span>
      )}

      {/* Manual Save Button */}
      {onSave && status !== 'saving' && (
        <Button
          variant={status === 'idle' ? 'default' : 'ghost'}
          size="sm"
          onClick={onSave}
          className="h-8 px-3 text-sm font-medium"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      )}
    </div>
  );
} 