'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  addYears,
  subYears,
  setHours,
  getHours,
  addMonths,
  subMonths,
  isSameDay,
  getMinutes,
  setMinutes,
} from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import { enUS } from 'date-fns/locale/en-US';
import { defaultPresets } from './constants';
import {
  formatDisplayValue,
  checkIsDateDisabled,
  getCalendarDays,
  checkIsDateSelected,
  computeDateSelection,
} from './date-picker-utils';
import type { DatePickerProps, DateRange } from './types';

export function useDatePicker({
  value,
  onChange,
  mode = 'single',
  enableTime = false,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],
  dateFormat = 'dd/MM/yyyy',
  timeFormat = 'HH:mm',
  locale = 'tr',
  weekStartsOn = 1,
  customPresets,
  onMonthChange,
  onYearChange,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value instanceof Date ? value : new Date(),
  );
  const [selectedTime, setSelectedTime] = useState({
    hours: value instanceof Date ? getHours(value) : 12,
    minutes: value instanceof Date ? getMinutes(value) : 0,
  });
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/Istanbul');
  const dateLocale = locale === 'tr' ? tr : enUS;

  const inputValue = useMemo(
    () =>
      formatDisplayValue(
        value ?? null,
        dateFormat,
        timeFormat,
        enableTime,
        dateLocale,
      ),
    [value, dateFormat, timeFormat, enableTime, dateLocale],
  );

  const isDateDisabled = useCallback(
    (date: Date) =>
      checkIsDateDisabled(
        date,
        minDate,
        maxDate,
        disabledDates,
        disabledDaysOfWeek,
      ),
    [minDate, maxDate, disabledDates, disabledDaysOfWeek],
  );

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth, weekStartsOn),
    [currentMonth, weekStartsOn],
  );

  const isDateSelected = useCallback(
    (date: Date) => checkIsDateSelected(date, value),
    [value],
  );

  const isRangeStart = useCallback(
    (date: Date) => {
      if (
        mode !== 'range' ||
        !value ||
        typeof value !== 'object' ||
        !('from' in value)
      ) {
        return false;
      }
      const { from } = value as DateRange;
      return from && isSameDay(date, from);
    },
    [mode, value],
  );

  const isRangeEnd = useCallback(
    (date: Date) => {
      if (
        mode !== 'range' ||
        !value ||
        typeof value !== 'object' ||
        !('from' in value)
      ) {
        return false;
      }
      const { to } = value as DateRange;
      return to && isSameDay(date, to);
    },
    [mode, value],
  );

  const handleDateSelect = useCallback(
    (selectedDate: Date) => {
      if (isDateDisabled(selectedDate)) return;

      const { newValue, shouldClose } = computeDateSelection({
        selectedDate,
        mode,
        value,
        enableTime,
        selectedTime,
      });

      if (shouldClose) {
        setIsOpen(false);
      }
      onChange?.(newValue);
    },
    [mode, value, enableTime, selectedTime, isDateDisabled, onChange],
  );

  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      setSelectedTime({ hours, minutes });
      if (value instanceof Date) {
        const newDate = setMinutes(setHours(value, hours), minutes);
        onChange?.(newDate);
      }
    },
    [value, onChange],
  );

  const handlePresetSelect = useCallback(
    (presetValue: Date | Date[] | DateRange) => {
      onChange?.(presetValue);
      if (mode === 'single' && !enableTime) {
        setIsOpen(false);
      }
    },
    [mode, enableTime, onChange],
  );

  const handleClear = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const goToPreviousMonth = useCallback(() => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  }, [currentMonth, onMonthChange]);

  const goToNextMonth = useCallback(() => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  }, [currentMonth, onMonthChange]);

  const goToPreviousYear = useCallback(() => {
    const newMonth = subYears(currentMonth, 1);
    setCurrentMonth(newMonth);
    onYearChange?.(newMonth.getFullYear());
  }, [currentMonth, onYearChange]);

  const goToNextYear = useCallback(() => {
    const newMonth = addYears(currentMonth, 1);
    setCurrentMonth(newMonth);
    onYearChange?.(newMonth.getFullYear());
  }, [currentMonth, onYearChange]);

  const presets = useMemo(() => {
    if (customPresets) return customPresets;
    return mode === 'range' ? defaultPresets.range : defaultPresets.single;
  }, [mode, customPresets]);

  return {
    isOpen,
    setIsOpen,
    currentMonth,
    selectedTime,
    selectedTimezone,
    setSelectedTimezone,
    inputValue,
    dateLocale,
    calendarDays,
    presets,
    isDateDisabled,
    isDateSelected,
    isRangeStart,
    isRangeEnd,
    handleDateSelect,
    handleTimeChange,
    handlePresetSelect,
    handleClear,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
  };
}
