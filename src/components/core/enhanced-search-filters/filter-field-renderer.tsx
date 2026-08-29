'use client';

import React from 'react';
import { Input } from '@/components/core/input';
import { Checkbox } from '@/components/core/checkbox';
import { cn } from '@/lib/utils';
import { FilterDateField, FilterDateRangeField } from './filter-date-fields';
import { FilterSelectField, FilterMultiSelectField } from './filter-select-fields';
import type { FilterField, FilterValues } from './types';

interface FilterFieldRendererProps {
  field: FilterField;
  values: FilterValues;
  size: 'small' | 'default' | 'large';
  onValueChange: (key: string, value: unknown) => void;
}

export function FilterFieldRenderer({
  field,
  values,
  size,
  onValueChange,
}: FilterFieldRendererProps) {
  if (!field.visible && field.visible !== undefined) return null;

  const value = values[field.key];
  const sizeHeightClass =
    size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : '';

  switch (field.type) {
    case 'text':
      return (
        <div key={field.key} className={cn('space-y-2', field.width)}>
          <label className="text-sm font-medium">{field.label}</label>
          <Input
            placeholder={field.placeholder}
            value={String(value || '')}
            onChange={(e) => onValueChange(field.key, e.target.value)}
            className={sizeHeightClass}
          />
        </div>
      );

    case 'number':
      return (
        <div key={field.key} className={cn('space-y-2', field.width)}>
          <label className="text-sm font-medium">{field.label}</label>
          <Input
            type="number"
            placeholder={field.placeholder}
            value={String(value ?? '')}
            onChange={(e) =>
              onValueChange(
                field.key,
                e.target.value ? Number(e.target.value) : '',
              )
            }
            min={field.validation?.min}
            max={field.validation?.max}
            className={sizeHeightClass}
          />
        </div>
      );

    case 'select':
      return (
        <FilterSelectField
          field={field}
          values={values}
          sizeHeightClass={sizeHeightClass}
          onValueChange={onValueChange}
        />
      );

    case 'multiselect':
      return (
        <FilterMultiSelectField
          field={field}
          values={values}
          sizeHeightClass={sizeHeightClass}
          onValueChange={onValueChange}
        />
      );

    case 'date':
      return (
        <FilterDateField
          field={field}
          values={values}
          sizeHeightClass={sizeHeightClass}
          onValueChange={onValueChange}
        />
      );

    case 'daterange':
      return (
        <FilterDateRangeField
          field={field}
          values={values}
          sizeHeightClass={sizeHeightClass}
          onValueChange={onValueChange}
        />
      );

    case 'boolean':
      return (
        <div key={field.key} className={cn('space-y-2', field.width)}>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => onValueChange(field.key, checked)}
            />
            <label className="text-sm font-medium">{field.label}</label>
          </div>
        </div>
      );

    default:
      return null;
  }
}
