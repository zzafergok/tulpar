# AGENTS.md — Tulpar Mühendislik, Mimari ve Çalışma Kuralları

Bu kurallar, **Tulpar** ve Tulpar'dan türetilen tüm Next.js + Firebase projelerinde istisnasız uygulanır. Mimari, güvenlik, API sözleşmeleri, Firebase, UI/UX, i18n, TypeScript, dosya modülerliği ve production checklist standartları oluşturulan veya değiştirilen tüm kodlar için zorunludur.

**Temel İlke:** **Güvenlik > Veri Bütünlüğü > Doğruluk > Performans & CWV > Modülerlik > Estetik**.

---

## 1. Görev Planlama, `tasks/todo.md` ve `tasks/lessons.md`

- Üç veya daha fazla adım içeren ya da mimari karar gerektiren her görevde uygulamaya başlamadan önce plan yapın (kapsam, varsayımlar, riskler, doğrulama adımları).
- Planı `tasks/todo.md` dosyasına işaretlenebilir maddeler halinde yazın ve ilerledikçe güncelleyin.
- **`tasks/todo.md` Tek Görev Odaklılığı:** `tasks/todo.md` her yeni kullanıcı isteğinde yalnızca o anki görevin maddelerini barındırmalıdır; yeni göreve başlarken önceki tamamlanmış maddeler temizlenmelidir. Görev sonunda yapılan değişiklikler ve doğrulama sonuçlarını içeren kısa bir inceleme özeti bırakılır.
- **Kalıcı Öğrenimler (`tasks/lessons.md`):** Oturum başında `tasks/lessons.md` gözden geçirilir. Mimari kararlar, hata çözümleri ve kullanıcı geri bildirimlerinden çıkarılan kalıcı kurallar `tasks/todo.md` yerine `tasks/lessons.md`'ye eklenir.
- Bir adım başarısız olursa hata ve logları inceleyip kök nedeni giderin; körü körüne devam etmeyin. Basit, bariz düzeltmelerde gereksiz süreç yükü oluşturmayın.

---

## 2. Proje Dizin Haritası, İsimlendirme ve Modülerlik

```text
src/
├── app/                      # Yalnızca App Router dosyaları (page, layout, loading, error, not-found, route.ts)
│   ├── (public)/             # Herkese açık sayfalar (/, /culture, /login)
│   ├── (auth)/               # Korumalı kullanıcı sayfaları (/home, /workspace, /settings)
│   ├── (admin)/              # Yönetim paneli (/admin/login, /admin, /admin/users, /admin/settings)
│   └── api/                  # REST Route Handlers (/api/auth/* ve domain endpoint'leri)
├── components/
│   ├── core/                 # Atomik temel UI bileşenleri (Button, Input, Table, Card, Link, Drawer vb.)
│   ├── forms/                # RHF + Zod destekli form alanları (Form, TextField, SelectField, SubmitButton vb.)
│   ├── layout/               # Kabuk düzenleri ve global kontroller (ApplicationShell, ThemeToggle, LanguageSwitcher, LogoutButton)
│   ├── providers/            # React context provider'ları (ClientLocaleProvider, QueryProvider, ThemeProvider)
│   └── shared/               # Birden fazla özellikte kullanılan bileşik yapılar (EnterpriseErrorBoundary, StandardCard vb.)
├── constants/                # Sabitler ve domain veri setleri
├── features/                 # Ekran modülleri ve domain iş mantığı (screen.tsx, components/, i18n/, types.ts)
├── hooks/                    # Custom React hook'ları (useApiQuery, useApiMutation, useAuthHooks, useI18n)
├── i18n/                     # Locale yönlendirme ve desteklenen diller (routing.ts)
├── lib/
│   ├── api/                  # apiClient (client/), ApiEnvelope (response/), withApiRoute (server/)
│   ├── auth/                 # JWT, session cookie, admin-auth, request-user, auth-schema
│   ├── firebase/             # admin.ts, client.ts, environment.ts, firestore-helpers.ts, session-verification.ts
│   ├── i18n/                 # Sunucu ve istek locale yardımcıları
│   ├── metadata/             # SEO, OG, site-metadata ve createStaticMetadata/createDynamicMetadata
│   ├── pagination/           # Sunucu tarafı sayfalama ve sıralama yardımcıları
│   ├── rate-limit/           # Hız sınırlama politikaları ve store
│   ├── security/             # İstek başına nonce tabanlı CSP (csp.ts)
│   └── utils/                # Saf yardımcılar (classnames, number-format vb.)
├── services/                 # API servis nesneleri ve CACHE_STRATEGIES
├── stores/                   # Zustand durum depoları (use-auth-store.ts)
├── types/                    # Ortak TypeScript tip ve arayüz tanımları
└── proxy.ts                  # Next.js 16 route guard, locale header ve güvenlik başlıkları
```

### Değişmez Modülerlik Kuralları

- **250 Satır Sınırı:** `src/`, `tests/` ve `scripts/` altındaki hiçbir kaynak dosya (bileşen, hook, yardımcı, şema, CSS ve tip dosyaları dahil) **250 satırı geçmemelidir**.
- **Klasör ve İndeksleme Yapısı:** Modülerleştirilen her dosya, **ana dosya adında kebab-case bir klasör** açılarak içine yerleştirilmeli ve klasör kökündeki `index.ts` üzerinden dışa aktarılmalıdır.
- **Mantıksal Ayrıştırma:** Bölme işlemi `types.ts`, `constants.ts`, `use-*.ts`, `*-utils.ts` ve odaklı alt bileşenler (`sub-components`) biçiminde sorumluluklara göre yapılır.
- **İsimlendirme Standartları:** Klasörler ve atomik UI/form dosyaları `kebab-case` (`text-field.tsx`, `date-picker`) olmalıdır. Çift uzantılı dosya adları (`.type.ts`, `.constants.ts`) kullanılmaz; düz `types.ts`, `constants.ts` kullanılır.
- **`src/app` Sınırı:** `src/app/` altında yalnızca Next.js App Router dosyaları bulunur; hiçbir ekran bileşeni veya form `src/app/` içinde tanımlanmaz, `src/features/` altında tutulur.

---

## 3. Alt-Ajan Kullanımı ve Tamamlama Ölçütü

- Bağımsız araştırma ve paralel analizler için alt-ajanları kullanarak ana bağlamı sade tutun; küçük veya sıkı bağımlı işlerde gereksiz delegasyondan kaçının.
- Basit olmayan değişikliklerde daha zarif ve küçük etkili bir çözüm olup olmadığını değerlendirin.
- Çalıştığı kanıtlanmadan (tip kontrolü, lint, metadata kontrolü, test, build) hiçbir görevi tamamlandı olarak işaretlemeyin.

---

## 4. Tasarım, Core Bileşenler, A11y ve React 19 Kuralları

- **Mevcut Tasarım Dili:** Yeni renk, tipografi, boşluk veya etkileşim yalnızca mevcut tema tokenları (`src/app/palette.css`, `src/app/globals.css`, `tailwind.config.mjs`) ile uyumluysa eklenebilir. Bileşenlerde ham hex renk yerine semantik CSS değişkenleri kullanılır.
- **Core Bileşen Zorunluluğu (HTML / Primitive Yasak):** Ham HTML öğeleri ve `next/link` (`<button>`, `<input>`, `<textarea>`, `<select>`, `<label>`, `<table>`, `<tr>`, `<td>`, `<hr>`, `next/link` vb.) doğrudan yazılmaz; karşılık gelen `@/components/core/*` bileşenleri (`button`, `input`, `textarea`, `select`, `label`, `table`, `card`, `badge`, `separator`, `link` vb.) kullanılır.
- **Tablo Semantiği:** Veri listelerinde `div` grid simülasyonları yerine `@/components/core/table` (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`) kullanılır.
- **Alias Zorunluluğu:** Göreceli derin yollar (`../../`) yerine daima `@/` alias'ı (`@/components/core/...`, `@/features/...`, `@/lib/...`) kullanılır.
- **React 19 Uyumu:** `react-hooks/set-state-in-effect` ve `rules-of-hooks` kuralları ihlal edilmez; `useEffect` içinde senkron `setState` ve render prop içinde hook çağrısı yapılmaz.
- **UI/UX ve "AI Kokusu" Önleme:** Aşırı glow, neon, yapay gradient, süs amaçlı kart ikonları ve kontrolsüz animasyonlardan kaçınılır; net CTA'lar, anlaşılır boş durumlar (empty-state) ve renk + ikon + kısa metin içeren durum bildirimleri kullanılır.
- **Erişilebilirlik (A11y):** Semantik landmarklar (`<main>`, `<nav>`, `<header>`, `<footer>`), mantıksal başlık hiyerarşisi (`h1`–`h6`), görünür `focus-visible` halkası, `prefers-reduced-motion` desteği, modal/drawer'larda odak hapsetme (focus trap), mobilde minimum `44x44px` dokunma hedefi ve `≥16px` input fontu sağlanır.
- **Font, Medya & Sayı Biçimlendirme:** Harici CSS `@import url(...)` yasaktır; `next/font/google` ve `next/image` (`sizes`, `priority`, `alt`) kullanılır. Para birimi, yüzde, süre ve sayı biçimlendirmelerinde `src/lib/utils/number-format/` (`Intl.NumberFormat`) kullanılır.

---

## 5. Formlar ve Doğrulama

- Tüm form alanları `@/components/forms` altındaki standart bileşenlerle (`Form`, `TextField`, `SelectField`, `DateField`, `AmountField`, `FileField`, `SwitchField`, `SubmitButton` vb.) kurulur; eksik alan bileşeni varsa bu dizinde oluşturulur.
- Tüm formlarda `react-hook-form` + `zod` + `@hookform/resolvers/zod` kullanılır.
- İstemci doğrulaması tek başına yeterli değildir: API Route Handler'lar da aynı kuralları sunucu tarafında `withApiRoute({ bodySchema })` ile doğrulamalıdır.
- Hata mesajları kullanıcıya anlaşılır Türkçe (veya aktif locale) ile gösterilmeli ve ilgili alanla ilişkilendirilmelidir.

---

## 6. TypeScript Standartları

- Açık, dar ve yeniden kullanılabilir tipler tanımlayın; API istekleri, yanıtları, bileşen props'ları ve form verileri tipli olmalıdır.
- `any` kullanımı kesinlikle yasaktır. Bilinmeyen dış veriler (API gövdeleri, Firestore dökümanları, JSON) `unknown` ile karşılanıp Zod (`safeParse` / `parseFirestoreDoc`) veya type guard ile daraltılır.
- `@ts-ignore`, `@ts-nocheck` ve gereksiz `as` type assertion kullanılmaz.

---

## 7. API Sözleşmesi, Interceptor ve İstemci Mimarisi

- **Sunucu Route Handler (`withApiRoute`):** Tüm API endpoint'leri `src/lib/api/server/route-handler.ts` içindeki `withApiRoute` wrapper'ını kullanmalıdır (`requireAuth`, `requireAdmin`, `rateLimitPolicy`, `bodySchema`, `x-request-id`).
- **Standart Yanıt Zarfı (`ApiEnvelope`):** Route handler'lar `src/lib/api/response/` içindeki `apiSuccess`, `apiError` ve `apiRateLimited` yardımcılarını kullanır:
  - Başarı: `{ ok: true, data, meta: { requestId } }` (`Cache-Control: no-store`, `X-Request-Id`)
  - Hata: `{ ok: false, error: { code, message, retryable, retryAfterSeconds? }, meta: { requestId } }`
- **İstemci HTTP (`apiClient`):** Bileşenler ve servisler doğrudan `fetch` yerine `src/lib/api/client/` (`apiClient`) kullanır. `apiClient`; Bearer/Firebase ID token enjeksiyonu, `401` otomatik oturum temizliği, timeout (`AbortController`), `/api` önek normalizasyonu, `ApiEnvelope` çözme ve opsiyonel `config.schema` Zod doğrulaması sağlar (`skipEnvelope: true` yalnızca harici zarfsız uçlar için kullanılır).
- **Veri & Önbellek:** TanStack React Query (`useApiQuery`, `useApiMutation`) kullanılır; global `staleTime: 0` korunur ve önbellek süreleri `src/services/` katmanında (`CACHE_STRATEGIES`) açıkça belirlenir.

---

## 8. Firebase, Kimlik Doğrulama ve Güvenlik

- **İstemci-Sunucu SDK Ayrımı:** Sunucuda Firebase Admin SDK veya gizli env tüketen tüm modüllerin ilk satırında `import 'server-only';` bulunur (`src/lib/firebase/admin.ts`, `firestore-helpers.ts`, `session-verification.ts`). `src/lib/firebase/client.ts` yalnızca tarayıcı tarafı Auth / okuma içindir; sunucu mutasyonları daima `getAdminFirestore()` ile yapılır.
- **Env Doğrulaması & Emulator Suite:** İstemci Firebase yapılandırması `src/lib/firebase/environment.ts` ile doğrulanır. Yerel geliştirme ve testlerde **Firebase Emulator Suite** (`firebase.json`, `NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true`, `FIREBASE_AUTH_EMULATOR_HOST`, `FIRESTORE_EMULATOR_HOST`, `FIREBASE_STORAGE_EMULATOR_HOST`) desteklenir.
- **Firestore Kuralları & IDOR Koruması:**
  - `firestore.rules` ve `storage.rules` varsayılan olarak **default-deny** (`allow read, write: if false;`) kalır; mutasyonlar Next.js Route Handler'larda `firebase-admin` üzerinden akar.
  - Her döküman 1 MB sınırına uygun tasarlanır (büyük listeler tek dökümanda `items: []` dizisi olarak değil, alt koleksiyonlarda `users/{uid}/...` tutulur).
  - Kullanıcıya ait döküman erişimlerinde `getOwnedDocument` / `getOwnedDocumentReference` (`src/lib/firebase/firestore-helpers.ts`) kullanılarak IDOR/BOLA engellenir.
- **Auth, Admin & Rate Limit:**
  - Oturumlar `HttpOnly`, `Secure` (prod), `SameSite=lax` çerezler (`session`, `admin_session`) ve HS256 JWT (`timingSafeEqual`, `src/lib/auth/jwt.ts`) ile yönetilir; hassas işlemlerde `isFirebaseUserSessionActive` ile iptal/devre dışı kontrolü yapılır.
  - Demo auth (`ALLOW_DEMO_AUTH=true`) yalnızca geliştirme ortamındadır; üretimde kapalıdır ve admin girişleri asla şifresiz/claimsiz kabul edilmez (`src/lib/auth/admin-auth.ts`).
  - Kimlik doğrulama ve mutasyon uçlarında `rateLimitPolicy` zorunludur.
- **CSP & Güvenlik Başlıkları:** `src/proxy.ts` istek başına kriptografik nonce'lu CSP (`src/lib/security/csp.ts`) ve güvenlik başlıklarını (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`) enjekte eder; `next.config.mjs` başlıklarıyla tutarlı tutulur.
- **Sırlar:** `.env*` secret değerleri asla istemciye (`NEXT_PUBLIC_` dışına) veya git geçmişine sızdırılmaz.

---

## 9. i18n, Metadata, Hata Yönetimi ve Test Stratejisi

- **Çoklu Dil (`tr` / `en`):** Tüm ekran ve kabuk metinleri ilgili modülün `i18n/{tr.json, en.json, types.ts, index.ts}` dosyalarında tutulur; arayüzde hard-coded metin bırakılmaz. Aktif dil `NEXT_LOCALE` çerezi, sunucuda `getCurrentLocale()` (`src/lib/i18n/server-locale.ts`) ve istemcide `useI18n()` ile okunur. Yeni dil anahtarı eklendiğinde `tr.json` ve `en.json` eşzamanlı güncellenir (`tests/i18n/i18n-dictionaries.test.ts`).
- **SEO & Rota Metadata:** Her `page.tsx`, `src/lib/metadata/page-metadata.ts` içindeki `createStaticMetadata` veya `createDynamicMetadata` ile metadata export etmelidir; `src/lib/metadata/site-metadata/routes.ts` merkezi rota kaynağıdır ve `npm run metadata:check` ile doğrulanır. Public/private indeksleme politikası `robots.ts`, `sitemap.ts` ve `llms.txt/route.ts` üzerinden tutarlı yönetilir.
- **Hata Yönetimi:** Tüm route gruplarında `error.tsx`, `loading.tsx` ve kök `not-found.tsx` tanımlı tutulur; istemci bileşen ağaçlarında `EnterpriseErrorBoundary` (`src/components/shared/enterprise-error-boundary/`) kullanılır. Production kodunda debug amaçlı `console.log` bırakılmaz.
- **Test Piramidi (`tests/`):**
  - **Unit & Integration (`npm test`):** Saf yardımcılar, Zod şemaları, JWT, rate-limit, `withApiRoute`, `ApiClient` ve i18n sözlükleri Vitest ile test edilir.
  - **Firebase Emulator (`npm run test:emulator`):** Firestore/Auth emulator gerektiren testler `*-emulator.test.ts` adlandırmasıyla `vitest.emulator.config.mts` üzerinden çalıştırılır.
  - **Production CSP (`tests/security/csp-http.test.mjs`):** CI'da production sunucusu ayağa kaldırılarak istek başına nonce rotasyonu ve `unsafe-inline`/`unsafe-eval` yokluğu doğrulanır.

---

## 10. Kalite Kontrolü & Production Pre-Flight Checklist

Her değişiklik sonrasında aşağıdaki doğrulama adımları sırasıyla ve hatasız geçmelidir:

```bash
npm run type-check      # TypeScript strict denetimi (tsc --noEmit)
npm run lint            # ESLint 9 denetimi
npm run metadata:check  # Tüm App Router sayfalarında metadata kontrolü
npm test                # Vitest birim ve entegrasyon testleri
npm run build           # Next.js Turbopack production derlemesi
```

### Production Pre-Flight Kontrol Listesi

- [ ] **Mimari & App Router:** Server/Client boundary bilinçli; `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` eksiksiz; `src/app` yalnızca route dosyalarını içeriyor; tüm dosyalar ≤250 satır.
- [ ] **Kod Kalitesi:** Sıfır `any`, sıfır `@ts-ignore`, dead code ve `console.log` temizlenmiş; magic değerler sabitlere taşınmış.
- [ ] **Auth & Güvenlik:** Korumalı route/API'ler sunucu doğrulamalı; `authenticateAdmin`, `getOwnedDocument` (IDOR), rate-limiting, `HttpOnly`/`Secure` çerezler ve nonce CSP aktif; `ALLOW_DEMO_AUTH=false`.
- [ ] **API & Firebase:** Tüm route'lar `withApiRoute` + `ApiEnvelope` kullanıyor; `firestore.rules` (default-deny), `storage.rules` ve `firestore.indexes.json` güncel.
- [ ] **Performans & CWV:** LCP, CLS, INP optimize; ağır modüller lazy-loaded; `next/image` ve `next/font` aktif; gereksiz bağımlılık yok.
- [ ] **Erişilebilirlik (A11y):** Semantik HTML, `h1`–`h6` sırası, klavye erişimi, `focus-visible`, focus trap, WCAG kontrastı, `prefers-reduced-motion` ve ≥44px dokunma hedefleri sağlanmış.
- [ ] **SEO & i18n:** `robots.ts`, `sitemap.ts`, `llms.txt`, OG/Twitter metadata eksiksiz; `tr`/`en` sözlük anahtarları eşit ve taşma yapmıyor.
- [ ] **CI/CD:** `.github/workflows/security.yml` (`npm audit`, `type-check`, `lint`, `metadata:check`, `test`, `build`, production CSP testi) yeşil.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
