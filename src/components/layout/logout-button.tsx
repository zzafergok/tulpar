'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from '@/components/core/toast';
import { CompactControl } from '@/components/shared/compact-control';
import { getShellCopy } from '@/features/routes/_shared/layouts/i18n';
import { useLogoutMutation } from '@/hooks/use-auth-hooks';
import { useI18n } from '@/hooks/use-i18n';
import { signOutFirebaseClient } from '@/lib/firebase/client';

interface LogoutButtonProps {
  redirectTo?: string;
}

export function LogoutButton({ redirectTo = '/login' }: LogoutButtonProps) {
  const router = useRouter();
  const { copy } = useI18n(getShellCopy);
  const logoutMutation = useLogoutMutation();

  const label = copy.preferenceControls?.logout ?? 'Sign Out';

  const handleLogout = async () => {
    try {
      await Promise.allSettled([
        logoutMutation.mutateAsync(),
        signOutFirebaseClient(),
      ]);
      toast.success(copy.preferenceControls?.logoutSuccess ?? 'Signed out.');
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error(copy.preferenceControls?.logoutError ?? 'Logout failed.');
    }
  };

  return (
    <CompactControl
      aria-label={label}
      title={label}
      disabled={logoutMutation.isPending}
      onClick={handleLogout}
    >
      <LogOut className="h-3.5 w-3.5" />
    </CompactControl>
  );
}
