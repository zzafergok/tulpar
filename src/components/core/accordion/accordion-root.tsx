'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AccordionContext } from './accordion-context';
import type { AccordionRootProps } from './types';

export function AccordionRoot({
  children,
  defaultValue = [],
  value,
  onValueChange,
  allowMultiple = false,
  className,
  type = 'single',
  collapsible = true,
}: AccordionRootProps) {
  const isMultiple = useMemo(
    () => type === 'multiple' || allowMultiple,
    [type, allowMultiple],
  );

  const [internalExpanded, setInternalExpanded] = useState<string[]>(
    defaultValue || [],
  );

  const isControlled = value !== undefined;
  const expandedItems = isControlled ? value : internalExpanded;

  const toggleItem = useCallback(
    (itemValue: string) => {
      const newValue = (() => {
        if (expandedItems.includes(itemValue)) {
          if (!collapsible && !isMultiple && expandedItems.length === 1) {
            return expandedItems;
          }
          return expandedItems.filter((item) => item !== itemValue);
        }

        if (isMultiple) {
          return [...expandedItems, itemValue];
        }

        return [itemValue];
      })();

      if (!isControlled) {
        setInternalExpanded(newValue);
      }

      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [expandedItems, isMultiple, collapsible, isControlled, onValueChange],
  );

  const isExpanded = useCallback(
    (itemValue: string) => expandedItems.includes(itemValue),
    [expandedItems],
  );

  const contextValue = useMemo(
    () => ({
      expandedItems,
      toggleItem,
      isExpanded,
      allowMultiple: isMultiple,
    }),
    [expandedItems, toggleItem, isExpanded, isMultiple],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('divide-y divide-gunmetal/30', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
