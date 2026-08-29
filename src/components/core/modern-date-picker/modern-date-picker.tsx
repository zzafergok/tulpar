'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/core/popover';
import { Button } from '@/components/core/button';
import { routing, toBCP47Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { datePickerCopy } from './constants';
import { QuickDatesSidebar } from './quick-dates-sidebar';
import { ModernCalendarGrid } from './modern-calendar-grid';
import type { ModernDatePickerProps } from './types';

export function ModernDatePicker({
  value,
  onChange,
  placeholder,
  disabled = false,
  clearable = true,
  minDate,
  maxDate,
  className,
  compact = false,
  error = false,
  includeTime = false,
  locale = routing.defaultLocale,
}: ModernDatePickerProps) {
  const copy = datePickerCopy[locale];
  const bcp47Locale = toBCP47Locale(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value?.getMonth() ?? new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    value?.getFullYear() ?? new Date().getFullYear(),
  );

  const displayValue = useMemo(() => {
    if (!value) return placeholder ?? copy.selectDate;
    return value.toLocaleDateString(bcp47Locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [bcp47Locale, copy.selectDate, value, placeholder]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(bcp47Locale, { month: 'long' }).format(
        new Date(2026, currentMonth, 1),
      ),
    [bcp47Locale, currentMonth],
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    const startDay = (firstDay.getDay() + 6) % 7;
    startDate.setDate(firstDay.getDate() - startDay);

    const endDay = (lastDay.getDay() + 6) % 7;
    endDate.setDate(lastDay.getDate() + (6 - endDay));

    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentMonth, currentYear]);

  const handleDateSelect = (date: Date) => {
    if (includeTime) {
      const dateWithTime = new Date(date);
      dateWithTime.setHours(0, 0, 0, 0);
      onChange(dateWithTime);
    } else {
      onChange(date);
    }
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleQuickDateSelect = (offsetDays: number) => {
    const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    if (includeTime) {
      date.setHours(0, 0, 0, 0);
    }
    onChange(date);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'h-10 w-full justify-start px-3 py-2 text-left font-normal',
            !value && 'text-ash/70',
            error && 'border-alert-red focus:border-alert-red',
            'hover:bg-gunmetal/10',
            'transition-all duration-200',
            className,
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4 shrink-0 text-ash" />
          <span className="truncate">{displayValue}</span>
          {clearable && value && !disabled && (
            <X
              className="ml-auto h-4 w-4 shrink-0 text-ash transition-colors hover:text-titanium"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'z-[150] max-w-[calc(100vw-2rem)] border border-gunmetal p-0 shadow-lg',
          compact
            ? 'w-[min(calc(100vw-2rem),18rem)]'
            : 'w-[min(calc(100vw-2rem),24rem)]',
        )}
        align="end"
        sideOffset={8}
        collisionPadding={12}
      >
        <div
          className={cn('flex', compact ? 'flex-col' : 'flex-col sm:flex-row')}
        >
          <QuickDatesSidebar
            compact={compact}
            quickSelectionLabel={copy.quickSelection as string}
            quickDates={copy.quickDates as string[]}
            onQuickDateSelect={handleQuickDateSelect}
          />

          <ModernCalendarGrid
            currentMonth={currentMonth}
            currentYear={currentYear}
            monthLabel={monthLabel}
            daysHeader={copy.days as string[]}
            calendarDays={calendarDays}
            bcp47Locale={bcp47Locale}
            value={value}
            previousMonthLabel={copy.previousMonth as string}
            nextMonthLabel={copy.nextMonth as string}
            doneLabel={copy.done as string}
            noDateLabel={copy.noDate as string}
            minDate={minDate}
            maxDate={maxDate}
            onNavigateMonth={navigateMonth}
            onDateSelect={handleDateSelect}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
