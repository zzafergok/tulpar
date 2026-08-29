import type { FilterField, FilterOption, FilterValues } from './types';

export function applyFilters<T>(
  data: T[],
  filters: FilterValues,
  fieldMap: Record<string, keyof T>,
): T[] {
  return data.filter((item) => {
    return Object.entries(filters).every(([filterKey, filterValue]) => {
      if (
        !filterValue ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      ) {
        return true;
      }

      const dataKey = fieldMap[filterKey];
      if (!dataKey) return true;

      const itemValue = item[dataKey];

      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }

      if (
        typeof filterValue === 'object' &&
        filterValue !== null &&
        'start' in filterValue &&
        'end' in filterValue
      ) {
        const range = filterValue as { start?: string; end?: string };
        if (range.start && range.end) {
          const itemDate = new Date(String(itemValue));
          const startDate = new Date(range.start);
          const endDate = new Date(range.end);
          return itemDate >= startDate && itemDate <= endDate;
        }
      }

      if (typeof filterValue === 'string') {
        return String(itemValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }

      return itemValue === filterValue;
    });
  });
}

export const CommonFilterFields = {
  dateRange: (key: string, label: string): FilterField => ({
    key,
    label,
    type: 'daterange',
    placeholder: 'Select date range',
  }),

  status: (
    key: string,
    label: string,
    options: FilterOption[],
  ): FilterField => ({
    key,
    label,
    type: 'select',
    options,
    allowClear: true,
    placeholder: 'Select status',
  }),

  multiStatus: (
    key: string,
    label: string,
    options: FilterOption[],
  ): FilterField => ({
    key,
    label,
    type: 'multiselect',
    options,
    placeholder: 'Select statuses',
  }),

  search: (key: string, label: string): FilterField => ({
    key,
    label,
    type: 'text',
    placeholder: 'Search...',
  }),

  boolean: (key: string, label: string): FilterField => ({
    key,
    label,
    type: 'boolean',
  }),
};
