import {
  getDay,
  format,
  isSameDay,
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
