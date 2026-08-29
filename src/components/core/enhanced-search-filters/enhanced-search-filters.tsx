'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';
import { FilterHeader } from './filter-header';
import { FilterFieldRenderer } from './filter-field-renderer';
import type { SearchFiltersProps } from './types';

export function EnhancedSearchFilters({
  values,
  onChange,
  onSearch,
  className,
  maxHeight,
  fields = [],
  groups = [],
  gridColumns = 3,
  size = 'default',
  showSearch = true,
  showClearAll = true,
  collapsible = false,
  layout = 'horizontal',
  showFilterCount = true,
  defaultCollapsed = false,
  searchPlaceholder = 'Search...',
}: SearchFiltersProps) {
  const [searchText, setSearchText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [groupCollapsed, setGroupCollapsed] = useState<Record<string, boolean>>(
    groups.reduce(
      (acc, group) => ({
        ...acc,
        [group.key]: group.defaultCollapsed || false,
      }),
      {},
    ),
  );

  const activeFilterCount = useMemo(() => {
    return Object.values(values).filter((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    }).length;
  }, [values]);

  const handleValueChange = useCallback(
    (key: string, value: unknown) => {
      onChange({
        ...values,
        [key]: value,
      });
    },
    [values, onChange],
  );

  const handleClearAll = useCallback(() => {
    onChange({});
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  }, [onChange, onSearch]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      if (onSearch) {
        onSearch(text);
      }
    },
    [onSearch],
  );

  const handleGroupCollapse = useCallback((groupKey: string) => {
    setGroupCollapsed((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-4';
      case 'grid':
        return `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridColumns}`;
      default:
        return 'flex flex-wrap items-end gap-4';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <FilterHeader
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        searchText={searchText}
        size={size}
        showFilterCount={showFilterCount}
        activeFilterCount={activeFilterCount}
        collapsible={collapsible}
        isCollapsed={isCollapsed}
        showClearAll={showClearAll}
        onSearchChange={handleSearch}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onClearAll={handleClearAll}
      />

      {(!collapsible || !isCollapsed) && (
        <div
          className={cn(
            'space-y-4 rounded-sm border border-gunmetal/30 p-4',
            maxHeight && 'overflow-auto',
          )}
          style={{ maxHeight }}
        >
          {/* Standalone Fields */}
          {fields.length > 0 && (
            <div className={getLayoutClasses()}>
              {fields.map((field) => (
                <FilterFieldRenderer
                  key={field.key}
                  field={field}
                  values={values}
                  size={size}
                  onValueChange={handleValueChange}
                />
              ))}
            </div>
          )}

          {/* Grouped Fields */}
          {groups.map((group) => (
            <div key={group.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{group.label}</h3>
                {group.collapsible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGroupCollapse(group.key)}
                  >
                    {groupCollapsed[group.key] ? (
                      <Plus className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              {(!group.collapsible || !groupCollapsed[group.key]) && (
                <div className={getLayoutClasses()}>
                  {group.fields.map((field) => (
                    <FilterFieldRenderer
                      key={field.key}
                      field={field}
                      values={values}
                      size={size}
                      onValueChange={handleValueChange}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
