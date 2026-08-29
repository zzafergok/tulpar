import { addDays, startOfMonth, endOfMonth } from 'date-fns';
import type { PresetOption, TimeZoneOption } from './types';

export const timeZones: TimeZoneOption[] = [
  { value: 'Europe/Istanbul', label: 'İstanbul (GMT+3)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export const defaultPresets: {
  single: PresetOption[];
  range: PresetOption[];
} = {
  single: [
    { label: 'Bugün', value: new Date() },
    { label: 'Yarın', value: addDays(new Date(), 1) },
    { label: 'Bir hafta sonra', value: addDays(new Date(), 7) },
  ],
  range: [
    {
      label: 'Son 7 gün',
      value: { from: addDays(new Date(), -7), to: new Date() },
    },
    {
      label: 'Son 30 gün',
      value: { from: addDays(new Date(), -30), to: new Date() },
    },
    {
      label: 'Bu ay',
      value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
  ],
};
