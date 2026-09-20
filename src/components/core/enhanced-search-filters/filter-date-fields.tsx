'use client';

import React from 'react';
import { DatePicker } from '@/components/core/date-picker';
import { Label } from '@/components/core/label';
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
      <Label className="text-sm font-medium">{field.label}</Label>
      <DatePicker
        mode="single"
        value={value ? new Date(String(value)) : null}
        onChange={(date) =>
          onValueChange(
            field.key,
            date instanceof Date ? date.toISOString() : undefined,
          )
        }
        placeholder={field.placeholder || 'Pick a date'}
        dateFormat="PPP"
        showFooter={false}
        className={cn(
          'w-full justify-start text-left font-normal',
          sizeHeightClass,
          !value && 'text-muted-foreground',
        )}
      />
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
      <Label className="text-sm font-medium">{field.label}</Label>
      <div className="flex items-center gap-2">
        <DatePicker
          mode="single"
          value={dateRangeVal.start ? new Date(dateRangeVal.start) : null}
          onChange={(date) =>
            onValueChange(field.key, {
              ...dateRangeVal,
              start: date instanceof Date ? date.toISOString() : undefined,
            })
          }
          placeholder="Start date"
          dateFormat="MMM dd"
          showFooter={false}
          className={cn(
            'flex-1 justify-start text-left font-normal',
            sizeHeightClass,
            !dateRangeVal.start && 'text-muted-foreground',
          )}
        />
        <span className="text-muted-foreground">to</span>
        <DatePicker
          mode="single"
          value={dateRangeVal.end ? new Date(dateRangeVal.end) : null}
          onChange={(date) =>
            onValueChange(field.key, {
              ...dateRangeVal,
              end: date instanceof Date ? date.toISOString() : undefined,
            })
          }
          placeholder="End date"
          dateFormat="MMM dd"
          showFooter={false}
          className={cn(
            'flex-1 justify-start text-left font-normal',
            sizeHeightClass,
            !dateRangeVal.end && 'text-muted-foreground',
          )}
        />
      </div>
    </div>
  );
}
