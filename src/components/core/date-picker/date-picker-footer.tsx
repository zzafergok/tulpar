'use client';

import React from 'react';
import { Button } from '@/components/core/button';
import type { DateRange } from './types';

interface DatePickerFooterProps {
  mode: 'single' | 'multiple' | 'range';
  value?: Date | Date[] | DateRange | null;
  clearable?: boolean;
  enableTime?: boolean;
  onClear: () => void;
  onClose: () => void;
}

export function DatePickerFooter({
  mode,
  value,
  clearable = true,
  enableTime = false,
  onClear,
  onClose,
}: DatePickerFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-gunmetal p-3">
      <div className="text-sm text-ash">
        {mode === 'multiple' && Array.isArray(value) && (
          <span>{value.length} tarih seçildi</span>
        )}
        {mode === 'range' &&
          value &&
          typeof value === 'object' &&
          'from' in value && (
            <span>
              {(value as DateRange).from && (value as DateRange).to
                ? `${Math.ceil(((value as DateRange).to!.getTime() - (value as DateRange).from!.getTime()) / (1000 * 60 * 60 * 24) + 1)} gün`
                : 'Bitiş tarihi seçin'}
            </span>
          )}
      </div>

      <div className="flex items-center gap-2">
        {clearable && value && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Temizle
          </Button>
        )}
        <Button size="sm" onClick={onClose}>
          {enableTime ? 'Tamam' : 'Kapat'}
        </Button>
      </div>
    </div>
  );
}
