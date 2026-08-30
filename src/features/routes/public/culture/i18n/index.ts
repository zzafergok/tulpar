import type { Locale } from '@/i18n/routing';
import { publicCultureEn } from './en';
import { publicCultureTr } from './tr';
import type { PublicCultureCopy } from '../types';

export function getPublicCultureCopy(locale: Locale): PublicCultureCopy {
  return locale === 'tr' ? publicCultureTr : publicCultureEn;
}
