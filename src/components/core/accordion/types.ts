import React from 'react';

export interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (value: string) => void;
  isExpanded: (value: string) => boolean;
  allowMultiple: boolean;
}

export interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
}

export interface AccordionRootProps {
  children: React.ReactNode;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  allowMultiple?: boolean;
  className?: string;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}

export interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  hideIcon?: boolean;
}

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}
