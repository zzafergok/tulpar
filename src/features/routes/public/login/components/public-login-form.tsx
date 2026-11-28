'use client';

import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/core/button';
import { Separator } from '@/components/core/separator';
import { Form, SubmitButton, TextField } from '@/components/forms';
import { toast } from '@/components/core/toast';
import {
  useFirebaseLoginMutation,
  useLoginMutation,
} from '@/hooks/use-auth-hooks';
import { ApiError } from '@/lib/api';
import { loginSchema, type LoginFormData } from '@/lib/auth/auth-schema';
import { demoLoginCredentials } from '@/lib/auth/demo-credentials';
import {
  isFirebaseClientConfigured,
  signInWithGooglePopup,
} from '@/lib/firebase/client';
import type { PublicLoginCopy } from '../types';

interface PublicLoginFormProps {
  copy: PublicLoginCopy;
}

export function PublicLoginForm({ copy }: PublicLoginFormProps) {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const firebaseLoginMutation = useFirebaseLoginMutation();
  const firebaseEnabled = isFirebaseClientConfigured();
  const isBusy = loginMutation.isPending || firebaseLoginMutation.isPending;

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation.mutateAsync({
        ...data,
        isAdmin: false,
      });
      toast.success(result.message ?? 'Giriş başarılı');
      router.push('/home');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Giriş yapılamadı';
      toast.error(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const idToken = await signInWithGooglePopup();
      const result = await firebaseLoginMutation.mutateAsync(idToken);
      toast.success(result.message ?? 'Google ile giriş başarılı');
      router.push('/home');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Google ile giriş yapılamadı';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <Form
        schema={loginSchema}
        defaultValues={{ ...demoLoginCredentials.user, isAdmin: false }}
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
          isLoading={isBusy}
          fullWidth
          className="rounded-none font-bold uppercase tracking-widest"
        >
          <LogIn className="mr-2 h-4 w-4" />
          {copy.submitLabel}
        </SubmitButton>
      </Form>

      {firebaseEnabled && (
        <>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="font-mono text-2xs uppercase tracking-widest text-ash">
              {copy.orDividerLabel}
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={handleGoogleSignIn}
            className="w-full rounded-none font-bold uppercase tracking-widest"
          >
            {copy.googleLoginLabel}
          </Button>
        </>
      )}
    </div>
  );
}
