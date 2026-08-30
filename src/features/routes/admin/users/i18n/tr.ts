import type { AdminUsersCopy } from '../types';

export const adminUsersTr: AdminUsersCopy = {
  title: 'Kullanıcılar',
  description: 'Gelecekteki kimlik entegrasyonları için dummy kullanıcı listesi.',
  cardTitle: 'Erişim listesi',
  columns: {
    name: 'Kullanıcı Adı',
    role: 'Rol',
    status: 'Durum',
  },
  users: [
    { name: 'Alex Morgan', role: 'Owner', status: 'Aktif' },
    { name: 'Jamie Lee', role: 'Admin', status: 'Davet edildi' },
    { name: 'Taylor Kim', role: 'Member', status: 'Aktif' },
  ],
};
