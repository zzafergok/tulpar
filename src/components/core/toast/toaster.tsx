'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Toast } from '@/types';
import { ToastItem } from './toast-item';
import { toast } from './toast-observer';

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts([...newToasts]);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-[420px] flex-col items-end gap-2 p-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
