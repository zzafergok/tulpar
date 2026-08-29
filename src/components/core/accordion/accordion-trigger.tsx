'use client';

import React, { useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccordionContext, useAccordionItemContext } from './accordion-context';
import type { AccordionTriggerProps } from './types';

export function AccordionTrigger({
  children,
  className,
  hideIcon = false,
}: AccordionTriggerProps) {
  const { toggleItem, isExpanded } = useAccordionContext();
  const { value, disabled } = useAccordionItemContext();
  const expanded = isExpanded(value);

  const handleClick = useCallback(() => {
    if (!disabled) {
      toggleItem(value);
    }
  }, [disabled, toggleItem, value]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-expanded={expanded}
      className={cn(
        'flex w-full items-center justify-between px-4 py-4 text-left text-base font-medium transition-colors',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-tulpar-blue/50',
        'hover:bg-gunmetal/20',
        expanded && 'bg-gunmetal/20',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      {children}

      {!hideIcon && (
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-ash transition-transform duration-200',
            expanded && 'rotate-180',
          )}
        />
      )}
    </button>
  );
}
