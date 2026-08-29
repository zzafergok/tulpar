'use client';

import React from 'react';
import { Button } from '@/components/core/button';
import type { DateRange, PresetOption } from './types';

interface PresetSidebarProps {
  enablePresets?: boolean;
  presets: PresetOption[];
  onPresetSelect: (value: Date | Date[] | DateRange) => void;
}

export function PresetSidebar({
  enablePresets = false,
  presets,
  onPresetSelect,
}: PresetSidebarProps) {
  if (!enablePresets || !presets.length) return null;

  return (
    <div className="w-48 border-r border-gunmetal p-3">
      <div className="mb-3 text-sm font-medium text-titanium">
        Hızlı Seçim
      </div>
      <div className="space-y-1">
        {presets.map((preset, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start px-2"
            onClick={() => onPresetSelect(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
