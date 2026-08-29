'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAccordionContext, AccordionItemContext } from './accordion-context';
import type { AccordionItemProps } from './types';

export function AccordionItem({
  children,
  value,
  disabled = false,
  className,
}: AccordionItemProps) {
  const { isExpanded } = useAccordionContext();
  const expanded = isExpanded(value);

  const contextValue = useMemo(
    () => ({
      value,
      disabled,
    }),
    [value, disabled],
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div
        data-state={expanded ? 'open' : 'closed'}
        data-disabled={disabled ? 'true' : undefined}
        className={cn(
          'w-full overflow-hidden transition-all',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
