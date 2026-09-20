'use client';

import React from 'react';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import { quickDateOffsets } from './constants';

interface QuickDatesSidebarProps {
  compact?: boolean;
  quickSelectionLabel: string;
  quickDates: string[];
  onQuickDateSelect: (offsetDays: number) => void;
}

export function QuickDatesSidebar({
  compact = false,
  quickSelectionLabel,
  quickDates,
  onQuickDateSelect,
}: QuickDatesSidebarProps) {
  return (
    <div
      className={cn(
        'border-gunmetal p-3',
        compact
          ? 'border-b'
          : 'border-b sm:w-32 sm:shrink-0 sm:border-b-0 sm:border-r',
      )}
    >
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ash/70">
        {quickSelectionLabel}
      </div>
      <div
        className={cn(
          compact
            ? 'grid grid-cols-2 gap-1'
            : 'grid grid-cols-2 gap-1 sm:block sm:space-y-1',
        )}
      >
        {quickDateOffsets.map((offsetDays, index) => (
          <Button
            type="button"
            key={index}
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start truncate px-2 text-compact font-normal hover:bg-tulpar-blue/10"
            onClick={() => onQuickDateSelect(offsetDays)}
          >
            {quickDates[index]}
          </Button>
        ))}
      </div>
    </div>
  );
}
