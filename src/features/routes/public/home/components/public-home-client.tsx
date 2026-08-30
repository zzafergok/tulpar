'use client';

import { TurkishCultureShowcase } from '@/features/turkish-culture';
import type { PublicHomeCopy } from '../types';

export function PublicHomeClient({ copy: _copy }: { copy: PublicHomeCopy }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <TurkishCultureShowcase />
    </div>
  );
}
