import type { Locale } from '@/i18n/routing';

export interface ModernDatePickerProps {
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
  value?: Date | null;
  clearable?: boolean;
  placeholder?: string;
  includeTime?: boolean;
  locale?: Locale;
  onChange: (date: Date | null) => void;
}
