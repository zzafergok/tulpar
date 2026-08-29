import React from 'react';

export type FilterType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'daterange'
  | 'boolean'
  | 'search';

export interface FilterOption {
  label: string;
  disabled?: boolean;
  description?: string;
  value: string | number | boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterField {
  key: string;
  label: string;
  width?: string;
  type: FilterType;
  visible?: boolean;
  multiple?: boolean;
  defaultValue?: unknown;
  placeholder?: string;
  searchable?: boolean;
  allowClear?: boolean;
  options?: FilterOption[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: RegExp;
  };
}

export interface FilterGroup {
  key: string;
  label: string;
  fields: FilterField[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FilterValues {
  [key: string]: unknown;
}

export interface SearchFiltersProps {
  className?: string;
  maxHeight?: string;
  values: FilterValues;
  showSearch?: boolean;
  gridColumns?: number;
  collapsible?: boolean;
  fields?: FilterField[];
  groups?: FilterGroup[];
  showClearAll?: boolean;
  showFilterCount?: boolean;
  searchPlaceholder?: string;
  defaultCollapsed?: boolean;
  size?: 'small' | 'default' | 'large';
  onSearch?: (searchText: string) => void;
  onChange: (values: FilterValues) => void;
  layout?: 'horizontal' | 'vertical' | 'grid';
}
