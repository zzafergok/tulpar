'use client';

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/core/input';
import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { cn } from '@/lib/utils';

interface FilterHeaderProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchText: string;
  size: 'small' | 'default' | 'large';
  showFilterCount?: boolean;
  activeFilterCount: number;
  collapsible?: boolean;
  isCollapsed: boolean;
  showClearAll?: boolean;
  onSearchChange: (text: string) => void;
  onToggleCollapse: () => void;
  onClearAll: () => void;
}

export function FilterHeader({
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchText,
  size,
  showFilterCount = true,
  activeFilterCount,
  collapsible = false,
  isCollapsed,
  showClearAll = true,
  onSearchChange,
  onToggleCollapse,
  onClearAll,
}: FilterHeaderProps) {
  const sizeHeightClass =
    size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : '';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {showSearch && (
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash/60" />
          <Input
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn('pl-9', sizeHeightClass)}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        {showFilterCount && activeFilterCount > 0 && (
          <Badge variant="secondary">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
          </Badge>
        )}

        {collapsible && (
          <Button
            variant="outline"
            size={size === 'small' ? 'sm' : 'default'}
            onClick={onToggleCollapse}
          >
            <Filter className="mr-2 h-4 w-4" />
            {isCollapsed ? 'Show Filters' : 'Hide Filters'}
          </Button>
        )}

        {showClearAll && (activeFilterCount > 0 || searchText) && (
          <Button
            variant="outline"
            size={size === 'small' ? 'sm' : 'default'}
            onClick={onClearAll}
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
