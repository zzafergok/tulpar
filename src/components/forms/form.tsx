'use client';

import * as React from 'react';
import {
  useForm,
  FieldValues,
  FormProvider,
  UseFormReturn,
  DefaultValues,
} from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export interface FormProps<T extends FieldValues> {
  id?: string;
  className?: string;
  autoComplete?: 'on' | 'off';
  children: React.ReactNode;
  schema: ZodType<T, ZodTypeDef & { typeName: string }, T>;
  defaultValues?: DefaultValues<T>;
  methods?: UseFormReturn<T>;
  onKeyDown?: React.KeyboardEventHandler<HTMLFormElement>;
  onSubmit: (
    data: T,
    methods: UseFormReturn<T>,
  ) => void | Promise<void>;
}

export function Form<T extends FieldValues>({
  id,
  schema,
  onSubmit,
  children,
  className,
  autoComplete,
  defaultValues,
  methods: externalMethods,
  onKeyDown,
}: FormProps<T>) {
  const internalMethods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const methods = externalMethods || internalMethods;

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        onSubmit={methods.handleSubmit((data) => onSubmit(data, methods))}
        onKeyDown={onKeyDown}
        className={className}
        autoComplete={autoComplete}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}

export { useFormContext } from 'react-hook-form';
export type { UseFormReturn, FieldValues };
