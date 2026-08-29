'use client';

import * as React from 'react';

import { X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function isPortalledFormControl(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('[data-radix-popper-content-wrapper]') !== null
  );
}

function isInsideDialogContent(
  target: EventTarget | null,
  content: HTMLElement | null,
): boolean {
  return target instanceof Node && Boolean(content?.contains(target));
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-void-black/80 backdrop-blur-sm',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  showCloseButton?: boolean;
  hideCloseButton?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      hideCloseButton = false,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      style,
      ...props
    },
    ref,
  ) => {
    const shouldShowCloseButton = hideCloseButton ? false : showCloseButton;
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(ref, contentRef);

    const shouldKeepDialogOpen = (target: EventTarget | null): boolean =>
      isPortalledFormControl(target) ||
      isInsideDialogContent(target, contentRef.current);

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={composedRef}
          style={{
            ...style,
            // A modal Select creates a higher DismissableLayer and Radix sets
            // lower layers to `pointer-events: none`. Keep the dialog content
            // interactive so an in-dialog click cannot fall through to overlay.
            pointerEvents: 'auto',
          }}
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gunmetal bg-obsidian p-6 duration-200 sm:rounded-none',
            className,
          )}
          onPointerDownOutside={(event) => {
            onPointerDownOutside?.(event);
            if (!event.defaultPrevented && shouldKeepDialogOpen(event.target)) {
              event.preventDefault();
            }
          }}
          onFocusOutside={(event) => {
            onFocusOutside?.(event);
            if (!event.defaultPrevented && shouldKeepDialogOpen(event.target)) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            onInteractOutside?.(event);
            if (event.defaultPrevented) return;

            if (shouldKeepDialogOpen(event.target)) {
              event.preventDefault();
            }
          }}
          {...props}
        >
          {children}
          {shouldShowCloseButton && (
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-none text-ash transition-colors hover:text-titanium focus:outline-none disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-ash/70', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogPortal,
  DialogHeader,
  DialogFooter,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogDescription,
};
