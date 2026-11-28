'use client';

import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { Form, SubmitButton, TextField } from '@/components/forms';
import { toast } from '@/components/core/toast';
import { useLoginMutation } from '@/hooks/use-auth-hooks';
import { ApiError } from '@/lib/api';
import { loginSchema, type LoginFormData } from '@/lib/auth/auth-schema';
import { demoLoginCredentials } from '@/lib/auth/demo-credentials';
import type { AdminLoginCopy } from '../types';

interface AdminLoginFormProps {
  copy: AdminLoginCopy;
}

export function AdminLoginForm({ copy }: AdminLoginFormProps) {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation.mutateAsync({
        ...data,
        isAdmin: true,
      });
      toast.success(result.message ?? 'Yönetici girişi başarılı');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Yönetici girişi yapılamadı';
      toast.error(message);
    }
  };

  return (
    <Form
      schema={loginSchema}
      defaultValues={{ ...demoLoginCredentials.admin, isAdmin: true }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <TextField
        name="email"
        label={copy.emailLabel}
        placeholder={copy.emailPlaceholder}
        type="email"
        required
      />
      <TextField
        name="password"
        label={copy.passwordLabel}
        placeholder={copy.passwordPlaceholder}
        type="password"
        required
      />
      <SubmitButton
        isLoading={loginMutation.isPending}
        fullWidth
        className="rounded-none font-bold uppercase tracking-widest"
      >
        <Shield className="mr-2 h-4 w-4" />
        {copy.submitLabel}
      </SubmitButton>
    </Form>
  );
}
