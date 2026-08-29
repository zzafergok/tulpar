'use client';

import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/core/popover';
import { Button } from '@/components/core/button';
import { Calendar } from '@/components/core/calendar';
import { cn } from '@/lib/utils';
import type { FilterField, FilterValues } from './types';

interface FilterDateFieldProps {
  field: FilterField;
  values: FilterValues;
  sizeHeightClass: string;
  onValueChange: (key: string, value: unknown) => void;
}

export function FilterDateField({
  field,
  values,
  sizeHeightClass,
  onValueChange,
}: FilterDateFieldProps) {
  const value = values[field.key];

  return (
    <div key={field.key} className={cn('space-y-2', field.width)}>
      <label className="text-sm font-medium">{field.label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              sizeHeightClass,
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value
              ? format(new Date(String(value)), 'PPP')
              : field.placeholder || 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(String(value)) : undefined}
            onSelect={(date) => onValueChange(field.key, date?.toISOString())}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function FilterDateRangeField({
  field,
  values,
  sizeHeightClass,
  onValueChange,
}: FilterDateFieldProps) {
  const value = values[field.key];
  const dateRangeVal =
    typeof value === 'object' && value !== null
      ? (value as { start?: string; end?: string })
      : {};

  return (
    <div key={field.key} className={cn('space-y-2', field.width)}>
      <label className="text-sm font-medium">{field.label}</label>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'flex-1 justify-start text-left font-normal',
                sizeHeightClass,
                !dateRangeVal.start && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRangeVal.start
                ? format(new Date(dateRangeVal.start), 'MMM dd')
                : 'Start date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                dateRangeVal.start ? new Date(dateRangeVal.start) : undefined
              }
              onSelect={(date) =>
                onValueChange(field.key, {
                  ...dateRangeVal,
                  start: date?.toISOString(),
                })
              }
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">to</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'flex-1 justify-start text-left font-normal',
                sizeHeightClass,
                !dateRangeVal.end && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRangeVal.end
                ? format(new Date(dateRangeVal.end), 'MMM dd')
                : 'End date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                dateRangeVal.end ? new Date(dateRangeVal.end) : undefined
              }
              onSelect={(date) =>
                onValueChange(field.key, {
                  ...dateRangeVal,
                  end: date?.toISOString(),
                })
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
