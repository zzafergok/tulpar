'use client';

import React, { useRef } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/core/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/core/popover';
import { cn } from '@/lib/utils';

import { CalendarHeader } from './calendar-header';
import { CalendarGrid } from './calendar-grid';
import { TimePicker } from './time-picker';
import { PresetSidebar } from './preset-sidebar';
import { DatePickerFooter } from './date-picker-footer';
import { useDatePicker } from './use-date-picker';
import type { DatePickerProps } from './types';

export function DatePicker(props: DatePickerProps) {
  const {
    value,
    mode = 'single',
    enableTime = false,
    enableTimezone = false,
    placeholder = 'Tarih seçin',
    showWeekNumbers = false,
    weekStartsOn = 1,
    disabled = false,
    readOnly = false,
    clearable = true,
    className,
    enablePresets = false,
    onFocus,
    onBlur,
  } = props;

  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
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
  } = useDatePicker(props);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-ash',
            className,
          )}
          disabled={disabled}
          onClick={() => !readOnly && setIsOpen(true)}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{inputValue || placeholder}</span>
          {clearable && value && !disabled && !readOnly && (
            <X
              className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <div className={cn('flex', enablePresets && 'min-w-[600px]')}>
          <PresetSidebar
            enablePresets={enablePresets}
            presets={presets}
            onPresetSelect={handlePresetSelect}
          />

          <div className="flex-1">
            <CalendarHeader
              currentMonth={currentMonth}
              dateLocale={dateLocale}
              goToPreviousYear={goToPreviousYear}
              goToPreviousMonth={goToPreviousMonth}
              goToNextMonth={goToNextMonth}
              goToNextYear={goToNextYear}
            />
            <CalendarGrid
              currentMonth={currentMonth}
              calendarDays={calendarDays}
              dateLocale={dateLocale}
              weekStartsOn={weekStartsOn}
              showWeekNumbers={showWeekNumbers}
              mode={mode}
              isDateSelected={isDateSelected}
              isDateDisabled={isDateDisabled}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              onDateSelect={handleDateSelect}
            />
            {enableTime && (
              <TimePicker
                hours={selectedTime.hours}
                minutes={selectedTime.minutes}
                enableTimezone={enableTimezone}
                selectedTimezone={selectedTimezone}
                onTimeChange={handleTimeChange}
                onTimezoneChange={setSelectedTimezone}
              />
            )}
            <DatePickerFooter
              mode={mode}
              value={value}
              clearable={clearable}
              enableTime={enableTime}
              onClear={handleClear}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
