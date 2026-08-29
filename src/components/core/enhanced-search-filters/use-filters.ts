'use client';

import { useState, useCallback, useMemo } from 'react';
import type { FilterValues } from './types';

export function useFilters(initialValues: FilterValues = {}) {
  const [values, setValues] = useState<FilterValues>(initialValues);

  const updateFilter = useCallback((key: string, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateFilters = useCallback((newValues: FilterValues) => {
    setValues(newValues);
  }, []);

  const clearFilter = useCallback((key: string) => {
    setValues((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setValues({});
  }, []);

  const getActiveFilters = useCallback(() => {
    return Object.entries(values).filter(([_, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });
  }, [values]);

  const hasActiveFilters = useMemo(() => {
    return getActiveFilters().length > 0;
  }, [getActiveFilters]);

  return {
    values,
    updateFilter,
    updateFilters,
    clearFilter,
    clearAllFilters,
    getActiveFilters,
    hasActiveFilters,
  };
}
