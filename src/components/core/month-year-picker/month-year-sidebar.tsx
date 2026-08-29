'use client';

import React from 'react';
import { Button } from '@/components/core/button';
import { QUICK_DATES } from './constants';
import type { QuickDateItem } from './types';

interface MonthYearSidebarProps {
  onQuickDateSelect: (quickDate: QuickDateItem) => void;
}

export function MonthYearSidebar({ onQuickDateSelect }: MonthYearSidebarProps) {
  return (
    <div className="min-w-[120px] border-r border-gunmetal p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ash/70">
        Hızlı Seçim
      </div>
      <div className="space-y-1">
        {QUICK_DATES.map((quickDate, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start px-2 text-xs font-normal hover:bg-tulpar-blue/10"
            onClick={() => onQuickDateSelect(quickDate)}
          >
            {quickDate.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
