import type { QuickDateItem } from './types';

export const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

export const QUICK_DATES: QuickDateItem[] = [
  {
    label: 'Bu Ay',
    getValue: () => {
      const now = new Date();
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
  {
    label: 'Geçen Ay',
    getValue: () => {
      const now = new Date();
      now.setMonth(now.getMonth() - 1);
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
  {
    label: '6 Ay Önce',
    getValue: () => {
      const now = new Date();
      now.setMonth(now.getMonth() - 6);
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
  {
    label: '1 Yıl Önce',
    getValue: () => {
      const now = new Date();
      now.setFullYear(now.getFullYear() - 1);
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    },
  },
];
