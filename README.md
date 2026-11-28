# TULPAR-FF

**TULPAR-FF (Frontend + Firebase)**; TULPAR şablon ailesinin Next.js 16 (App Router), Firebase, React 19, TypeScript, Tailwind CSS, Zustand, TanStack React Query ve Radix UI üzerine inşa edilmiş kurumsal web uygulaması altyapısı ve şablonudur.

Public sayfalar (Landing, Login), korumalı kullanıcı alanları (Home, Workspace, Settings) ve yönetim panelleri (Admin Login, Overview, Users, Settings) için hazır uygulama kabukları (Shells), Firebase Auth/Firestore entegrasyonu, güvenlik katmanı, API interceptor mimarisi, form altyapısı ve durum yönetimi sunar.

---

## 📚 İçindekiler

- [TULPAR-FF](#tulpar-ff)
  - [📚 İçindekiler](#-i̇çindekiler)
  - [🚀 Öne Çıkan Özellikler ve Mimari](#-öne-çıkan-özellikler-ve-mimari)
  - [🛠️ Teknoloji Yığını](#️-teknoloji-yığını)
  - [📁 Proje Dizin Yapısı](#-proje-dizin-yapısı)
  - [🎓 Eğitici Mimari Rehber](#-eğitici-mimari-rehber)
    - [1. API Client ve Interceptor Kullanımı](#1-api-client-ve-interceptor-kullanımı)
    - [2. Servis ve Önbellekleme Katmanı (`CACHE_STRATEGIES`)](#2-servis-ve-önbellekleme-katmanı-cache_strategies)
    - [3. Zustand ve React Query Auth Hook'ları](#3-zustand-ve-react-query-auth-hookları)
    - [4. Güvenlik, CSP ve Firebase Emulator Suite](#4-güvenlik-csp-ve-firebase-emulator-suite)
  - [⚡ Kurulum ve Komutlar](#-kurulum-ve-komutlar)
    - [1. Kurulum](#1-kurulum)
    - [2. Kullanılabilir Komutlar](#2-kullanılabilir-komutlar)
  - [📄 Lisans](#-lisans)

---

## 🚀 Öne Çıkan Özellikler ve Mimari

- **Next.js 16 App Router & Native Proxy (`src/proxy.ts`):**
  - Rota koruması (Route Guard), locale yönlendirmesi, istek başına nonce CSP ve HTTP güvenlik başlıkları (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`).
- **Firebase Auth & Session Katmanı:**
  - `HttpOnly`, `Secure` (prod), `SameSite=lax` çerezler ([session.ts](src/lib/auth/session.ts)), JWT doğrulama ([jwt.ts](src/lib/auth/jwt.ts)) ve Next.js API Route Handler'ları (`/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/firebase`).
  - Varsayılan kapalı `firestore.rules` + `storage.rules` ve Firebase Emulator Suite yapılandırması (`firebase.json`).
- **Tip Güvenli API Client & Durum Yönetimi:**
  - Zustand `useAuthStore` + `apiClient` ([client.ts](src/lib/api/client/client.ts)) ile Bearer token enjeksiyonu, `401` otomatik oturum temizliği ve `ApiEnvelope` çözümleme.
  - TanStack React Query içinde global `staleTime: 0` korunur; servis bazlı önbellek süreleri `CACHE_STRATEGIES` ile yönetilir.
- **Arayüz, Form ve i18n:**
  - Brutalist dark-mode-first renk paleti, 60+ atomik `@/components/core/*` bileşeni, RHF + Zod `@/components/forms/*` alanları, Türkçe (TR) ve İngilizce (EN) i18n altyapısı.

---

## 🛠️ Teknoloji Yığını

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Backend / Auth Servisi:** Firebase SDK (`firebase`, `firebase-admin`) + Firebase Emulator Suite
- **State & Data:** Zustand v5, TanStack React Query v5
- **Stil & UI:** Tailwind CSS, `next-themes`, Framer Motion, `@base-ui/react`, Radix UI, `@tanstack/react-table`, Recharts, Lucide Icons
- **Form & Validasyon:** React Hook Form, `@hookform/resolvers`, Zod
- **Test & Kalite:** Vitest (unit + Firebase Emulator testleri), Testing Library, ESLint 9, Prettier

---

## 📁 Proje Dizin Yapısı

```text
src/
├── app/                      # App Router sayfaları & API endpoint'leri
│   ├── (public)/             # Landing ve Login (/, /login)
│   ├── (auth)/               # Korumalı kullanıcı sayfaları (/home, /workspace, /settings)
│   ├── (admin)/admin/        # Yönetim paneli (/admin/login ve (shell)/ altı)
│   └── api/auth/             # login, register, logout, me, firebase route handler'ları
├── features/routes/          # Ekran modülleri (_shared/layouts, public, auth, admin)
├── components/
│   ├── core/                 # Atomik UI bileşenleri (button, card, badge, dialog vb.)
│   ├── forms/                # RHF + Zod form alanları (form, text-field, select vb.)
│   ├── layout/               # ApplicationShell, AppShellLayout, AdminAppShellLayout, LanguageSwitcher, ThemeToggle, LogoutButton, page-header
│   ├── providers/            # ClientLocaleProvider, LocaleHtmlSync, QueryProvider, ThemeProvider
│   └── shared/               # EnterpriseErrorBoundary, StandardCard vb.
├── stores/                   # use-auth-store.ts
├── lib/
│   ├── api/                  # apiClient (client/), ApiEnvelope (response/), withApiRoute (server/)
│   ├── auth/                 # jwt.ts, session.ts, admin-auth.ts, firebase-identity.ts, demo-credentials.ts, auth-schema.ts, request-user.ts
│   ├── firebase/             # admin.ts, client.ts, environment.ts, firestore-helpers.ts, session-verification.ts
│   ├── i18n/                 # Sunucu ve istek locale yardımcıları
│   ├── metadata/             # SEO, OG ve site-metadata/routes.ts
│   ├── pagination/           # Sunucu tarafı sayfalama yardımcıları
│   ├── rate-limit/           # Hız sınırlama politikaları ve store
│   ├── security/             # csp.ts (nonce tabanlı CSP)
│   └── design/, utils/       # Tema yardımcıları ve biçimleyiciler
├── services/                 # auth-service.ts, example-service.ts
├── hooks/                    # use-api-query.ts, use-auth-hooks.ts, use-i18n.ts, use-mobile.ts, use-mounted.ts
└── proxy.ts                  # Route Guard ve güvenlik başlıkları
```

---

## 🎓 Eğitici Mimari Rehber

### 1. API Client ve Interceptor Kullanımı

```typescript
import { apiClient } from '@/lib/api';

const me = await apiClient.get<{ user: AuthUser }>('/api/auth/me');

const response = await apiClient.post<LoginResponse>('/api/auth/login', {
  email: 'pilot@tulpar.space',
  password: 'securePassword123',
});
```

### 2. Servis ve Önbellekleme Katmanı (`CACHE_STRATEGIES`)

```typescript
import { useApiQuery } from '@/hooks/use-api-query';

export const CACHE_STRATEGIES = {
  REALTIME: { staleTime: 0, gcTime: 0 },
  SHORT: { staleTime: 1000 * 30, gcTime: 1000 * 60 * 5 },
  MEDIUM: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 15 },
  LONG: { staleTime: 1000 * 60 * 60, gcTime: 1000 * 60 * 60 * 24 },
} as const;
```

### 3. Zustand ve React Query Auth Hook'ları

Projede ham `<button>` yerine daima `@/components/core/button` bileşeni kullanılır:

```typescript
'use client';

import { Button } from '@/components/core/button';
import { useCurrentUserQuery, useLoginMutation, useLogoutMutation } from '@/hooks/use-auth-hooks';

export function LoginFormComponent() {
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const { data: userData } = useCurrentUserQuery();

  const handleLogin = async () => {
    await loginMutation.mutateAsync({
      email: 'admin@tulpar.space',
      password: 'securePassword123',
      isAdmin: true,
    });
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleLogin} disabled={loginMutation.isPending}>
        {userData ? 'Yenile' : 'Giriş Yap'}
      </Button>
      <Button variant="outline" onClick={() => logoutMutation.mutate()}>
        Çıkış Yap
      </Button>
    </div>
  );
}
```

### 4. Güvenlik, CSP ve Firebase Emulator Suite

`src/proxy.ts` yetkisiz kullanıcıları `/home` ve `/admin` rotalarından yönlendirir, nonce tabanlı CSP uygular. Yerel Firebase ortamı için `.env.local` içinde `NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true` ve emulator hostlarını açıp `firebase emulators:start` ile geliştirme yapabilirsiniz (bkz. [.env.example](.env.example), [.firebaserc.example](.firebaserc.example)).

---

## ⚡ Kurulum ve Komutlar

### 1. Kurulum

```bash
cp .env.example .env.local
cp .firebaserc.example .firebaserc   # (Firebase CLI kullanacaksanız)
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

### 2. Kullanılabilir Komutlar

```bash
npm run dev             # Geliştirme sunucusu
npm run build           # Production build
npm run start           # Derlenmiş sunucuyu başlatır
npm run type-check      # tsc --noEmit
npm run lint            # ESLint denetimi
npm run format          # Prettier ile formatlar
npm run format:check    # Prettier kontrolü
npm run metadata:check  # Rota metadata kontrolü
npm test                # Vitest birim ve entegrasyon testleri
npm run test:watch      # Watch modunda Vitest
npm run test:emulator   # Firebase Emulator entegrasyon testleri
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
