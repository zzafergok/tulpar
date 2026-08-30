import type { ShellCopy } from '../types';

export const shellTr: ShellCopy = {
  brand: {
    title: 'Tulpar',
    subtitle: 'Next.js Şablonu & Kültür Atlası',
  },
  publicNav: [
    {
      href: '/login',
      label: 'Giriş',
      subtitle: 'Kimlik Doğrulama',
      icon: 'login',
    },
  ],
  authNav: [
    {
      href: '/home',
      label: 'Ana sayfa',
      subtitle: 'Dashboard özeti',
      icon: 'home',
    },
    {
      href: '/workspace',
      label: 'Öğeler',
      subtitle: 'Çalışma alanı',
      icon: 'wrench',
    },
    {
      href: '/settings',
      label: 'Ayarlar',
      subtitle: 'Hesap ve tercihler',
      icon: 'settings',
    },
  ],
  adminNav: [
    {
      href: '/admin',
      label: 'Özet',
      subtitle: 'Yönetim kontrolü',
      icon: 'shield',
    },
    {
      href: '/admin/users',
      label: 'Kullanıcılar',
      subtitle: 'Kullanıcı yönetimi',
      icon: 'users',
    },
    {
      href: '/admin/settings',
      label: 'Ayarlar',
      subtitle: 'Platform ayarları',
      icon: 'settings',
    },
  ],
  authHeader: {
    title: 'Auth Alanı',
    subtitle: 'Korumalı uygulama alanı',
  },
  adminHeader: {
    title: 'Admin Alanı',
    subtitle: 'Yönetim kontrol alanı',
    manageLabel: 'Yönet',
  },
  loading: 'Yükleniyor...',
  footer: 'Tulpar Template © 2026',
  preferenceControls: {
    themeLight: 'Açık temaya geç',
    themeDark: 'Koyu temaya geç',
    themeError: 'Tema tercihi kaydedilemedi.',
    languageError: 'Dil tercihi kaydedilemedi.',
  },
  density: {
    label: 'Görünüm yoğunluğu',
    compact: 'Kompakt',
    detailed: 'Detaylı',
  },
};
