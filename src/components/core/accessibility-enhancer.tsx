'use client';

import React, { forwardRef, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface AccessibleRegionProps extends HTMLAttributes<HTMLElement> {
  label?: string;
  busy?: boolean;
  atomic?: boolean;
  description?: string;
  as?: React.ElementType;
  live?: 'off' | 'polite' | 'assertive';
  relevant?: React.AriaAttributes['aria-relevant'];
}

export const AccessibleRegion = forwardRef<
  HTMLElement,
  AccessibleRegionProps
>(
  (
    {
      label,
      description,
      live = 'off',
      atomic = false,
      relevant = 'additions text',
      busy = false,
      as: Component = 'div',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        role="region"
        aria-label={label}
        aria-describedby={description ? `${props.id}-desc` : undefined}
        aria-live={live}
        aria-atomic={atomic}
        aria-relevant={relevant}
        aria-busy={busy}
        className={cn('outline-none', className)}
        {...props}
      >
        {description && (
          <div id={`${props.id}-desc`} className="sr-only">
            {description}
          </div>
        )}
        {children}
      </Component>
    );
  },
);

AccessibleRegion.displayName = 'AccessibleRegion';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-tulpar-blue focus:px-4 focus:py-2 focus:text-white focus:outline-none"
    >
      {children}
    </a>
  );
}

interface AccessibleListProps extends HTMLAttributes<HTMLUListElement> {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  multiselectable?: boolean;
}

export const AccessibleList = forwardRef<HTMLUListElement, AccessibleListProps>(
  (
    {
      label,
      orientation = 'vertical',
      multiselectable = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <ul
        ref={ref}
        role="listbox"
        aria-label={label}
        aria-orientation={orientation}
        aria-multiselectable={multiselectable}
        className={cn('list-none', className)}
        {...props}
      >
        {children}
      </ul>
    );
  },
);

AccessibleList.displayName = 'AccessibleList';

interface AccessibleListItemProps extends HTMLAttributes<HTMLLIElement> {
  selected?: boolean;
  disabled?: boolean;
  level?: number;
}

export const AccessibleListItem = forwardRef<
  HTMLLIElement,
  AccessibleListItemProps
>(
  (
    {
      selected = false,
      disabled = false,
      level,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <li
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled}
        className={cn(
          'outline-none',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </li>
    );
  },
);

AccessibleListItem.displayName = 'AccessibleListItem';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Component = 'span', className, children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn('sr-only', className)} {...props}>
        {children}
      </Component>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
