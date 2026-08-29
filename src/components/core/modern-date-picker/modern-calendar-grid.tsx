'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';

interface ModernCalendarGridProps {
  currentMonth: number;
  currentYear: number;
  monthLabel: string;
  daysHeader: string[];
  calendarDays: Date[];
  bcp47Locale: string;
  value?: Date | null;
  previousMonthLabel: string;
  nextMonthLabel: string;
  doneLabel: string;
  noDateLabel: string;
  minDate?: Date;
  maxDate?: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export function ModernCalendarGrid({
  currentMonth,
  currentYear,
  monthLabel,
  daysHeader,
  calendarDays,
  bcp47Locale,
  value,
  previousMonthLabel,
  nextMonthLabel,
  doneLabel,
  noDateLabel,
  minDate,
  maxDate,
  onNavigateMonth,
  onDateSelect,
  onClose,
}: ModernCalendarGridProps) {
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!value) return false;
    return date.toDateString() === value.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="min-w-0 flex-1 p-3">
      {/* Calendar header */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onNavigateMonth('prev')}
          aria-label={previousMonthLabel}
          className="h-8 w-8 p-0 hover:bg-gunmetal/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1 text-center text-sm font-semibold text-titanium">
          {monthLabel} {currentYear}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onNavigateMonth('next')}
          aria-label={nextMonthLabel}
          className="h-8 w-8 p-0 hover:bg-gunmetal/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {daysHeader.map((day) => (
          <div
            key={day}
            className="flex h-8 min-w-0 items-center justify-center text-xs font-medium text-ash"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const selected = isDateSelected(date);
          const today = isToday(date);
          const currentMonthDate = isCurrentMonth(date);
          const disabled = isDateDisabled(date);

          return (
            <Button
              type="button"
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                'relative h-8 w-full min-w-0 p-0 text-sm font-normal',
                !currentMonthDate && 'text-ash/30',
                currentMonthDate &&
                  !selected &&
                  'text-titanium hover:bg-gunmetal/20',
                selected &&
                  'bg-vantor-blue text-white hover:bg-vantor-blue/90',
                today &&
                  !selected &&
                  'border border-vantor-blue/20 bg-vantor-blue/10 text-vantor-blue',
                disabled && 'cursor-not-allowed opacity-50',
              )}
              onClick={() => !disabled && onDateSelect(date)}
              disabled={disabled}
              aria-label={date.toLocaleDateString(bcp47Locale, {
                dateStyle: 'long',
              })}
              aria-pressed={selected}
            >
              {date.getDate()}
              {today && !selected && (
                <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-none bg-vantor-blue" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gunmetal pt-3">
        <div className="text-xs text-ash">
          {value ? value.toLocaleDateString(bcp47Locale) : noDateLabel}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onClose}
          className="h-7 px-3 text-xs"
        >
          {doneLabel}
        </Button>
      </div>
    </div>
  );
}
