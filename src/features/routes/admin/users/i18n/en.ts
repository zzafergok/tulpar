import type { AdminUsersCopy } from '../types';

export const adminUsersEn: AdminUsersCopy = {
  title: 'Users',
  description: 'Dummy user roster for future identity integrations.',
  cardTitle: 'Access roster',
  columns: {
    name: 'User Name',
    role: 'Role',
    status: 'Status',
  },
  users: [
    { name: 'Alex Morgan', role: 'Owner', status: 'Active' },
    { name: 'Jamie Lee', role: 'Admin', status: 'Invited' },
    { name: 'Taylor Kim', role: 'Member', status: 'Active' },
  ],
};
