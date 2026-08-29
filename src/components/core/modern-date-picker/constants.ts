import type { Locale } from '@/i18n/routing';

export const datePickerCopy = {
  tr: {
    quickSelection: 'Hızlı Seçim',
    quickDates: [
      'Bugün',
      'Yarın',
      '1 Hafta Sonra',
      '2 Hafta Sonra',
      '1 Ay Sonra',
    ],
    days: ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'],
    noDate: 'Tarih seçilmedi',
    selectDate: 'Tarih seçin',
    done: 'Tamam',
    previousMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',
  },
  en: {
    quickSelection: 'Quick Select',
    quickDates: ['Today', 'Tomorrow', 'In 1 Week', 'In 2 Weeks', 'In 1 Month'],
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    noDate: 'No date selected',
    selectDate: 'Select date',
    done: 'Done',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export const quickDateOffsets = [0, 1, 7, 14, 30] as const;
