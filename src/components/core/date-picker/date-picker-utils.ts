import {
  getDay,
  format,
  addDays,
  setHours,
  isSameDay,
  setMinutes,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  type Locale as DateFnsLocale,
} from 'date-fns';
import type { DateRange } from './types';

export function formatDisplayValue(
  date: Date | Date[] | DateRange | null,
  dateFormat: string,
  timeFormat: string,
  enableTime: boolean,
  dateLocale: DateFnsLocale,
): string {
  if (!date) return '';

  try {
    if (date instanceof Date) {
      const formatString = enableTime
        ? `${dateFormat} ${timeFormat}`
        : dateFormat;
      return format(date, formatString, { locale: dateLocale });
    }

    if (Array.isArray(date)) {
      return date
        .map((d) => format(d, dateFormat, { locale: dateLocale }))
        .join(', ');
    }

    if (typeof date === 'object' && 'from' in date) {
      const { from, to } = date as DateRange;
      if (!from) return '';
      if (!to) return format(from, dateFormat, { locale: dateLocale });
      return `${format(from, dateFormat, { locale: dateLocale })} - ${format(to, dateFormat, { locale: dateLocale })}`;
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }

  return '';
}

export function checkIsDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates: Date[] = [],
  disabledDaysOfWeek: number[] = [],
): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates.some((disabledDate) => isSameDay(date, disabledDate)))
    return true;
  if (disabledDaysOfWeek.includes(getDay(date))) return true;
  return false;
}

export function getCalendarDays(
  currentMonth: Date,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1,
): Date[] {
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn });
  const days: Date[] = [];
  let day = start;

  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days;
}

export function checkIsDateSelected(
  date: Date,
  value?: Date | Date[] | DateRange | null,
): boolean {
  if (!value) return false;

  if (value instanceof Date) {
    return isSameDay(date, value);
  }

  if (Array.isArray(value)) {
    return value.some((selectedDate) => isSameDay(date, selectedDate));
  }

  if (typeof value === 'object' && 'from' in value) {
    const { from, to } = value as DateRange;
    if (!from) return false;
    if (!to) return isSameDay(date, from);
    return isWithinInterval(date, { start: from, end: to });
  }

  return false;
}

export function computeDateSelection({
  selectedDate,
  mode,
  value,
  enableTime,
  selectedTime,
}: {
  selectedDate: Date;
  mode: 'single' | 'multiple' | 'range';
  value?: Date | Date[] | DateRange | null;
  enableTime: boolean;
  selectedTime: { hours: number; minutes: number };
}): { newValue: Date | Date[] | DateRange | null; shouldClose: boolean } {
  const dateWithTime = enableTime
    ? setMinutes(
        setHours(selectedDate, selectedTime.hours),
        selectedTime.minutes,
      )
    : selectedDate;

  switch (mode) {
    case 'single':
      return {
        newValue: dateWithTime,
        shouldClose: !enableTime,
      };

    case 'multiple': {
      const currentArray = Array.isArray(value) ? value : [];
      const existingIndex = currentArray.findIndex((date) =>
        isSameDay(date, selectedDate),
      );

      if (existingIndex >= 0) {
        return {
          newValue: currentArray.filter((_, index) => index !== existingIndex),
          shouldClose: false,
        };
      }
      return {
        newValue: [...currentArray, dateWithTime],
        shouldClose: false,
      };
    }

    case 'range': {
      const currentRange =
        value && typeof value === 'object' && 'from' in value
          ? (value as DateRange)
          : { from: null, to: null };

      if (!currentRange.from || (currentRange.from && currentRange.to)) {
        return {
          newValue: { from: dateWithTime, to: null },
          shouldClose: false,
        };
      }

      const from = currentRange.from;
      const to = dateWithTime;
      return {
        newValue: from <= to ? { from, to } : { from: to, to: from },
        shouldClose: !enableTime,
      };
    }
  }
}
