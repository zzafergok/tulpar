'use client';

import React from 'react';
import {
  format,
  isToday,
  addDays,
  startOfWeek,
  isSameMonth,
  type Locale as DateFnsLocale,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  currentMonth: Date;
  calendarDays: Date[];
  dateLocale: DateFnsLocale;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers?: boolean;
  mode: 'single' | 'multiple' | 'range';
  isDateSelected: (date: Date) => boolean;
  isDateDisabled: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean | null;
  isRangeEnd: (date: Date) => boolean | null;
  onDateSelect: (date: Date) => void;
}

export function CalendarGrid({
  currentMonth,
  calendarDays,
  dateLocale,
  weekStartsOn,
  showWeekNumbers = false,
  mode,
  isDateSelected,
  isDateDisabled,
  isRangeStart,
  isRangeEnd,
  onDateSelect,
}: CalendarGridProps) {
  // Week days header
  const weekDays = [];
  const start = startOfWeek(new Date(), { weekStartsOn });

  for (let i = 0; i < 7; i++) {
    const day = addDays(start, i);
    weekDays.push(
      <div key={i} className="p-2 text-center text-sm font-medium text-ash">
        {format(day, 'EEE', { locale: dateLocale })}
      </div>,
    );
  }

  // Weeks grid
  const weeks: React.ReactNode[] = [];
  let week: React.ReactNode[] = [];

  calendarDays.forEach((day, index) => {
    if (showWeekNumbers && index % 7 === 0) {
      week.push(
        <div
          key={`week-${index}`}
          className="p-2 text-center text-sm text-ash/50"
        >
          {format(day, 'w')}
        </div>,
      );
    }

    const isCurrentMonthDate = isSameMonth(day, currentMonth);
    const isSelected = isDateSelected(day);
    const isDisabled = isDateDisabled(day);
    const isTodayDate = isToday(day);
    const isRangeStartDate = isRangeStart(day);
    const isRangeEndDate = isRangeEnd(day);

    week.push(
      <button
        key={day.toISOString()}
        onClick={() => onDateSelect(day)}
        disabled={isDisabled}
        className={cn(
          'relative h-10 w-10 rounded-sm text-sm transition-colors',
          'hover:bg-gunmetal/20',
          'focus:outline-none focus:ring-1 focus:ring-inset focus:ring-vantor-blue/50',
          !isCurrentMonthDate && 'text-ash/30',
          isCurrentMonthDate && 'text-titanium',
          isTodayDate &&
            !isSelected &&
            'border border-vantor-blue/20 bg-vantor-blue/10 text-vantor-blue',
          isSelected && 'bg-vantor-blue text-white',
          isRangeStartDate && 'rounded-r-none',
          isRangeEndDate && 'rounded-l-none',
          isSelected &&
            mode === 'range' &&
            !isRangeStartDate &&
            !isRangeEndDate &&
            'rounded-none',
          isDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
        )}
      >
        {format(day, 'd')}
        {isTodayDate && !isSelected && (
          <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-sm bg-vantor-blue" />
        )}
      </button>,
    );

    if ((index + 1) % 7 === 0 || index === calendarDays.length - 1) {
      weeks.push(
        <div
          key={`week-${Math.floor(index / 7)}`}
          className={cn(
            'grid gap-1',
            showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7',
          )}
        >
          {week}
        </div>,
      );
      week = [];
    }
  });

  return (
    <>
      <div
        className={cn('grid grid-cols-7', showWeekNumbers && 'grid-cols-8')}
      >
        {showWeekNumbers && (
          <div className="p-2 text-center text-sm font-medium text-ash">#</div>
        )}
        {weekDays}
      </div>
      <div className="space-y-1 p-3">{weeks}</div>
    </>
  );
}
