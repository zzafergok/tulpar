import type { AdminOverviewCopy } from '../types';

export const adminOverviewTr: AdminOverviewCopy = {
  title: 'Yönetim özeti',
  description:
    'Kullanıcılar, ayarlar ve Tulpar durumu için genel yönetim paneli.',
  cards: [
    { label: 'Tulpar durumu', value: 'Hazır', icon: 'activity' },
    { label: 'Erişim seviyesi', value: 'Admin', icon: 'shieldCheck' },
    { label: 'Kültür verisi', value: 'Aktif', icon: 'database' },
  ],
};
