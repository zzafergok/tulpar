'use client';

import { createContext, useContext } from 'react';
import type { AccordionContextValue, AccordionItemContextValue } from './types';

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Accordion bileşenleri bir AccordionRoot içinde kullanılmalıdır',
    );
  }
  return context;
};

export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

export const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      'AccordionTrigger ve AccordionContent bir AccordionItem içinde kullanılmalıdır',
    );
  }
  return context;
};
