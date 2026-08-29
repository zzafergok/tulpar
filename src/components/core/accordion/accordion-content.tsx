'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAccordionContext, useAccordionItemContext } from './accordion-context';
import type { AccordionContentProps } from './types';

export function AccordionContent({
  children,
  className,
  forceMount = false,
}: AccordionContentProps) {
  const { isExpanded } = useAccordionContext();
  const { value } = useAccordionItemContext();
  const expanded = isExpanded(value);

  return (
    <AnimatePresence initial={false}>
      {(expanded || forceMount) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className={cn('px-4 pb-4 pt-4', className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
