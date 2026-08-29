'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import { MONTHS } from './constants';

interface MonthYearGridProps {
  currentYear: number;
  value?: string;
  minDate?: string;
  maxDate?: string;
  displayValue: string;
  onNavigateYear: (direction: 'prev' | 'next') => void;
  onMonthSelect: (monthIndex: number) => void;
  onClose: () => void;
}

export function MonthYearGrid({
  currentYear,
  value,
  minDate,
  maxDate,
  displayValue,
  onNavigateYear,
  onMonthSelect,
  onClose,
}: MonthYearGridProps) {
  const isMonthDisabled = (monthIndex: number) => {
    const monthValue = `${currentYear}-${(monthIndex + 1).toString().padStart(2, '0')}`;
    if (minDate && monthValue < minDate) return true;
    if (maxDate && monthValue > maxDate) return true;
    return false;
  };

  const isMonthSelected = (monthIndex: number) => {
    if (!value) return false;
    const monthValue = `${currentYear}-${(monthIndex + 1).toString().padStart(2, '0')}`;
    return monthValue === value;
  };

  const isCurrentMonth = (monthIndex: number) => {
    const now = new Date();
    return now.getFullYear() === currentYear && now.getMonth() === monthIndex;
  };

  return (
    <div className="min-w-[280px] p-3">
      {/* Year navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigateYear('prev')}
          className="h-8 w-8 p-0 hover:bg-gunmetal/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-[80px] text-center text-lg font-semibold text-titanium">
          {currentYear}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigateYear('next')}
          className="h-8 w-8 p-0 hover:bg-gunmetal/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Months grid */}
      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month, index) => {
          const selected = isMonthSelected(index);
          const current = isCurrentMonth(index);
          const disabled = isMonthDisabled(index);

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                'relative flex h-10 items-center justify-center px-3 text-sm font-normal',
                'text-titanium hover:bg-gunmetal/20',
                selected && 'bg-vantor-blue text-white hover:bg-vantor-blue/90',
                current &&
                  !selected &&
                  'border border-vantor-blue/20 bg-vantor-blue/10 text-vantor-blue',
                disabled && 'cursor-not-allowed opacity-50',
              )}
              onClick={() => !disabled && onMonthSelect(index)}
              disabled={disabled}
            >
              {month}
              {current && !selected && (
                <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-vantor-blue" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gunmetal pt-3">
        <div className="text-xs text-ash">
          {value ? displayValue : 'Ay/Yıl seçilmedi'}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onClose}
          className="h-7 px-3 text-xs"
        >
          Tamam
        </Button>
      </div>
    </div>
  );
}
