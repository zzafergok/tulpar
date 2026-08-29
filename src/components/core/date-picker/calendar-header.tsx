'use client';

import React from 'react';
import { format, type Locale as DateFnsLocale } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/core/button';

interface CalendarHeaderProps {
  currentMonth: Date;
  dateLocale: DateFnsLocale;
  goToPreviousYear: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToNextYear: () => void;
}

export function CalendarHeader({
  currentMonth,
  dateLocale,
  goToPreviousYear,
  goToPreviousMonth,
  goToNextMonth,
  goToNextYear,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gunmetal p-3">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToPreviousYear}
        >
          <ChevronLeft className="h-4 w-4" />
          <ChevronLeft className="-ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="font-medium">
        {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToNextYear}
        >
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="-ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
