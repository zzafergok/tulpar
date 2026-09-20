'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-obsidian group-[.toaster]:text-titanium group-[.toaster]:border-gunmetal/80 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-sm font-mono text-sm',
          description: 'group-[.toast]:text-ash',
          actionButton:
            'group-[.toast]:bg-tulpar-blue group-[.toast]:text-white group-[.toast]:rounded-xs font-mono text-xs',
          cancelButton:
            'group-[.toast]:bg-gunmetal/40 group-[.toast]:text-ash group-[.toast]:rounded-xs font-mono text-xs',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
