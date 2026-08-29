import type { AdminOverviewCopy } from '../types';

export const adminOverviewEn: AdminOverviewCopy = {
  title: 'Management overview',
  description:
    'Management dashboard for users, settings, and Tulpar status.',
  cards: [
    { label: 'Tulpar status', value: 'Ready', icon: 'activity' },
    { label: 'Access level', value: 'Admin', icon: 'shieldCheck' },
    { label: 'Culture data', value: 'Active', icon: 'database' },
  ],
};
