'use client';

import * as React from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-none border border-border bg-background px-3 py-2 font-mono text-sm text-foreground transition-colors focus:border-vantor-blue/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-vantor-blue/70 disabled:cursor-not-allowed disabled:opacity-40 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

function getFocusableOutsideTarget(
  target: EventTarget | null,
): HTMLElement | null {
  if (!(target instanceof Element)) return null;

  const focusableTarget = target.closest(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
  );

  return focusableTarget instanceof HTMLElement ? focusableTarget : null;
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  (
    {
      className,
      children,
      position = 'popper',
      onCloseAutoFocus,
      onPointerDownOutside,
      ...props
    },
    ref,
  ) => {
    const outsidePointerTargetRef = React.useRef<HTMLElement | null>(null);

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-[10000] max-h-96 min-w-[8rem] overflow-hidden rounded-none border border-border bg-card text-foreground shadow-lg',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className,
          )}
          position={position}
          onPointerDownOutside={(event) => {
            onPointerDownOutside?.(event);
            if (event.defaultPrevented) return;

            outsidePointerTargetRef.current = getFocusableOutsideTarget(
              event.detail.originalEvent.target,
            );
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);
            if (event.defaultPrevented) return;

            const outsidePointerTarget = outsidePointerTargetRef.current;
            outsidePointerTargetRef.current = null;
            if (!outsidePointerTarget) return;

            event.preventDefault();
            window.requestAnimationFrame(() => {
              if (outsidePointerTarget.isConnected) {
                outsidePointerTarget.focus({ preventScroll: true });
              }
            });
          }}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              'p-1',
              position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

interface SelectItemProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> {
  endAdornment?: React.ReactNode;
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, endAdornment, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-none py-1.5 pl-7 pr-2 font-mono text-xs text-foreground outline-none focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
      {children}
    </SelectPrimitive.ItemText>
    {endAdornment && (
      <span aria-hidden="true" className="ml-auto shrink-0 pl-3">
        {endAdornment}
      </span>
    )}
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

type NativeSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'defaultValue' | 'onChange' | 'value'
> & {
  options?: NativeSelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

export interface NativeSelectOption {
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  label: React.ReactNode;
  value: string | number;
}

/**
 * Form-friendly adapter around the Radix Select primitives. It accepts
 * native-looking option children so existing controlled form code can use a
 * custom select without emitting a browser `<select>` element.
 */
const NativeSelect = ({
  children,
  className,
  defaultValue,
  disabled,
  id,
  name,
  onChange,
  options: providedOptions,
  required,
  value,
  ...props
}: NativeSelectProps) => {
  // The remaining native attributes are accepted for backwards compatibility.
  // Radix Select's trigger is a button, so they cannot be forwarded directly.
  void props;

  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue === undefined ? undefined : String(defaultValue),
  );
  const selectedValue = value === undefined ? uncontrolledValue : String(value);

  const childOptions = React.Children.toArray(children).flatMap((child) => {
    if (
      !React.isValidElement<React.OptionHTMLAttributes<HTMLOptionElement>>(
        child,
      )
    ) {
      return [];
    }

    return [
      {
        disabled: child.props.disabled,
        endAdornment: undefined,
        label: child.props.children,
        value: String(child.props.value ?? ''),
      },
    ];
  });
  const options = providedOptions
    ? providedOptions.map((option) => ({
        ...option,
        value: String(option.value),
      }))
    : childOptions;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const handleValueChange = (nextValue: string) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    onChange?.({
      currentTarget: { id, name, value: nextValue },
      target: { id, name, value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Select
      value={selectedValue}
      defaultValue={
        defaultValue === undefined ? undefined : String(defaultValue)
      }
      onValueChange={handleValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger
        id={id}
        aria-required={required}
        className={cn(
          'rounded-none border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-vantor-blue',
          className,
        )}
      >
        <SelectValue placeholder="Seçiniz">
          {selectedValue ? (selectedOption?.label ?? selectedValue) : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            endAdornment={option.endAdornment}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
NativeSelect.displayName = 'NativeSelect';

export {
  Select,
  NativeSelect,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectTrigger,
  SelectContent,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
