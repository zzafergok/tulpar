'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/core/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/core/popover';
import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { Checkbox } from '@/components/core/checkbox';
import { Label } from '@/components/core/label';
import { cn } from '@/lib/utils';
import type { FilterField, FilterValues } from './types';

interface FilterSelectFieldProps {
  field: FilterField;
  values: FilterValues;
  sizeHeightClass: string;
  onValueChange: (key: string, value: unknown) => void;
}

export function FilterSelectField({
  field,
  values,
  sizeHeightClass,
  onValueChange,
}: FilterSelectFieldProps) {
  const value = values[field.key];

  return (
    <div key={field.key} className={cn('space-y-2', field.width)}>
      <Label className="text-sm font-medium">{field.label}</Label>
      <Select
        value={String(value || '')}
        onValueChange={(newValue) => onValueChange(field.key, newValue)}
      >
        <SelectTrigger className={sizeHeightClass}>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.allowClear && (
            <SelectItem value="">
              <span className="text-muted-foreground">Clear selection</span>
            </SelectItem>
          )}
          {field.options?.map((option) => (
            <SelectItem
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.disabled}
            >
              <div className="flex items-center gap-2">
                {option.icon && <option.icon className="h-4 w-4" />}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FilterMultiSelectField({
  field,
  values,
  sizeHeightClass,
  onValueChange,
}: FilterSelectFieldProps) {
  const value = values[field.key];
  const selectedList = Array.isArray(value) ? value : [];

  return (
    <div key={field.key} className={cn('space-y-2', field.width)}>
      <Label className="text-sm font-medium">{field.label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between',
              sizeHeightClass,
              !selectedList.length && 'text-muted-foreground',
            )}
          >
            {selectedList.length ? (
              <div className="flex items-center gap-1">
                <Badge variant="secondary">{selectedList.length} selected</Badge>
              </div>
            ) : (
              field.placeholder || 'Select options'
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-auto">
            {field.options?.map((option) => (
              <div
                key={String(option.value)}
                className="flex items-center space-x-2 p-2 hover:bg-muted"
              >
                <Checkbox
                  checked={selectedList.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...selectedList, option.value]
                      : selectedList.filter((v) => v !== option.value);
                    onValueChange(field.key, newValues);
                  }}
                  disabled={option.disabled}
                />
                <div className="flex items-center gap-2">
                  {option.icon && <option.icon className="h-4 w-4" />}
                  <span className="text-sm">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
