import type { Metadata } from 'next';

import { routing, type Locale } from '@/i18n/routing';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  'https://tulpar.dev';

export const siteMetadata = {
  name: 'Tulpar',
  legalName: 'Tulpar Next.js Uygulama Şablonu ve Kültür Temeli',
  description:
    'Geliştiricilere kadim Türk kültürü ve renk kozmolojisini öğretirken modern Next.js 16 mimarisini sunan domain-independent kurumsal uygulama şablonu.',
  url: new URL(siteUrl),
  creator: 'Tulpar',
  publisher: 'Tulpar',
  keywords: [
    'Tulpar',
    'Next.js template',
    'Next.js 16 starter kit',
    'Turkish culture showcase',
    'application shell',
    'admin dashboard',
    'authenticated workspace',
    'cultural knowledge cards',
  ],
  assets: {
    icon16: '/assets/images/favicon-16x16.png',
    icon32: '/assets/images/favicon-32x32.png',
    icon48: '/assets/images/favicon-48x48.png',
    shortcutIcon: '/favicon.ico',
    appleTouchIcon: '/assets/images/apple-touch-icon.png',
    android192: '/assets/images/android-chrome-192x192.png',
    android512: '/assets/images/android-chrome-512x512.png',
    logo: '/assets/images/tulpar-brand-mark.jpeg',
    openGraph: '/assets/images/tulpar-open-graph.jpeg',
  },
  aiSummary:
    'Tulpar is an enterprise-grade Next.js 16 application template and starter kit featuring an educational Turkic culture and AI prompt studio showcase alongside public, authenticated, and admin shells.',
} as const;

type RouteRobots = {
  index: boolean;
  follow: boolean;
};

type RouteSection = 'public' | 'auth' | 'admin';

export type MetadataRouteId =
  | 'publicHome'
  | 'publicCulture'
  | 'publicLogin'
  | 'authHome'
  | 'authWorkspace'
  | 'authSettings'
  | 'adminLogin'
  | 'adminOverview'
  | 'adminUsers'
  | 'adminSettings';

type LocalizedRouteMetadata = {
  title: string;
  description: string;
  aiPurpose: string;
};

type RouteMetadataDescriptor = {
  path: string;
  section: RouteSection;
  robots: RouteRobots;
  locale: Record<Locale, LocalizedRouteMetadata>;
};

export type RouteMetadataInput = {
  path: string;
  section?: RouteSection;
  robots?: RouteRobots;
  locale?: Partial<Record<Locale, Partial<LocalizedRouteMetadata>>>;
  title?: string;
  description?: string;
  aiPurpose?: string;
};

export type DynamicRouteMetadataInput = RouteMetadataInput & {
  canonicalPath?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
};

export const routeMetadata = {
  publicHome: {
    path: '/',
    section: 'public',
    robots: { index: true, follow: true },
    locale: {
      en: {
        title: 'Next.js Application Template & Starter Foundation',
        description:
          'Enterprise Next.js 16 application template and starter kit featuring multi-shell layouts, typed forms, and an educational Turkic culture showcase.',
        aiPurpose:
          'Primary public overview for AI agents summarizing the Tulpar enterprise application template architecture.',
      },
      tr: {
        title: 'Next.js 16 Enterprise Uygulama Şablonu & Mimari Altyapı',
        description:
          'Çoklu uygulama kabukları, tipli formlar, özel core bileşenler ve Türk kültür vitrini içeren kurumsal Next.js 16 şablonu.',
        aiPurpose:
          'Tulpar enterprise uygulama şablonunun mimari yapısını ve kabuklarını özetleyen AI tanıtım ekranı.',
      },
    },
  },
  publicCulture: {
    path: '/culture',
    section: 'public',
    robots: { index: true, follow: true },
    locale: {
      en: {
        title: 'Turkic Culture & Mythology Atlas',
        description:
          'Educational showcase featuring 40+ ancient Turkic culture cards, Göktürk color cosmology, and AI prompt studio.',
        aiPurpose:
          'Public educational Turkic culture and AI prompt generation studio showcase.',
      },
      tr: {
        title: 'Türk Kültür & Mitoloji Atlası',
        description:
          '40+ kadim Türk kültür kartı, Göktürk renk kozmolojisi ve Yapay Zeka (AI Prompt) stüdyosu içeren eğitici vitrin.',
        aiPurpose:
          'Halka açık eğitici Türk kültürü ve yapay zeka prompt üretim stüdyosu vitrini.',
      },
    },
  },
  publicLogin: {
    path: '/login',
    section: 'public',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Sign in',
        description:
          'Placeholder sign-in surface for future authentication provider integrations.',
        aiPurpose:
          'Public login entry point; excluded from indexing because it is transactional.',
      },
      tr: {
        title: 'Giriş Yap',
        description:
          'Gelecekteki kimlik sağlayıcı entegrasyonları için giriş arayüzü.',
        aiPurpose:
          'Genel giriş noktası; işlemsel olduğu için indekslemeden hariç tutulur.',
      },
    },
  },
  authHome: {
    path: '/home',
    section: 'auth',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Dashboard overview',
        description:
          'Protected dashboard overview with neutral sample data for future product modules.',
        aiPurpose:
          'Authenticated dashboard route; metadata is descriptive but not intended for indexing.',
      },
      tr: {
        title: 'Kontrol Paneli Özeti',
        description:
          'Gelecekteki ürün modülleri için örnek veriler içeren korumalı kontrol paneli özeti.',
        aiPurpose:
          'Kullanıcı kontrol paneli rotası; indeksleme için hedeflenmemiştir.',
      },
    },
  },
  authWorkspace: {
    path: '/workspace',
    section: 'auth',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Items workspace',
        description:
          'Protected generic list workspace for future authenticated application modules.',
        aiPurpose:
          'Authenticated workspace route for internal records; excluded from public AI discovery.',
      },
      tr: {
        title: 'Çalışma Alanı',
        description:
          'Korumalı genel veri listesi ve modüler kayıt çalışma alanı.',
        aiPurpose:
          'Dahili kayıtlar için çalışma alanı rotası; genel AI keşfinden hariç tutulur.',
      },
    },
  },
  authSettings: {
    path: '/settings',
    section: 'auth',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Account settings',
        description:
          'Protected account-level settings for the Tulpar application shell.',
        aiPurpose:
          'Authenticated settings route; excluded from indexing and AI discovery lists.',
      },
      tr: {
        title: 'Hesap Ayarları',
        description:
          'Tulpar uygulama kabuğu için korumalı hesap düzeyi ayarlar.',
        aiPurpose:
          'Kullanıcı ayarlar rotası; indeksleme ve AI keşif listelerinden hariç tutulur.',
      },
    },
  },
  adminLogin: {
    path: '/admin/login',
    section: 'admin',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Admin login',
        description:
          'Admin sign-in surface for management access to the Tulpar shell.',
        aiPurpose:
          'Administrative login route; blocked from indexing and AI discovery.',
      },
      tr: {
        title: 'Yönetici Girişi',
        description:
          'Tulpar kabuğu yönetim erişimi için yönetici giriş arayüzü.',
        aiPurpose:
          'Yönetim giriş rotası; indeksleme ve AI keşfinden engellenir.',
      },
    },
  },
  adminOverview: {
    path: '/admin',
    section: 'admin',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Management overview',
        description:
          'Protected management dashboard for users, settings, and Tulpar status.',
        aiPurpose:
          'Protected admin overview route; not intended for public crawlers.',
      },
      tr: {
        title: 'Yönetim Özeti',
        description:
          'Kullanıcılar, ayarlar ve platform durumu için korumalı yönetim paneli.',
        aiPurpose:
          'Korumalı yönetici genel bakış rotası; arama motorları için hedeflenmemiştir.',
      },
    },
  },
  adminUsers: {
    path: '/admin/users',
    section: 'admin',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Admin users',
        description:
          'Protected admin user roster for future identity integrations.',
        aiPurpose:
          'Protected admin users route; noindex because it models identity data.',
      },
      tr: {
        title: 'Yönetici Kullanıcıları',
        description:
          'Gelecekteki kimlik entegrasyonları için korumalı kullanıcı listesi.',
        aiPurpose:
          'Kimlik verisini modellediği için indekslenmeyen korumalı kullanıcı rotası.',
      },
    },
  },
  adminSettings: {
    path: '/admin/settings',
    section: 'admin',
    robots: { index: false, follow: false },
    locale: {
      en: {
        title: 'Admin settings',
        description:
          'Protected configuration surface for Tulpar-level controls.',
        aiPurpose:
          'Protected admin configuration route; blocked from indexing and AI discovery.',
      },
      tr: {
        title: 'Yönetici Ayarları',
        description:
          'Tulpar platform düzeyindeki kontroller için korumalı yapılandırma arayüzü.',
        aiPurpose:
          'Korumalı yönetici yapılandırma rotası; indeksleme ve AI keşfinden engellenir.',
      },
    },
  },
} satisfies Record<MetadataRouteId, RouteMetadataDescriptor>;

function absoluteUrl(path: string): string {
  return new URL(path, siteMetadata.url).toString();
}

function isMetadataRouteId(
  route: MetadataRouteId | RouteMetadataInput,
): route is MetadataRouteId {
  return typeof route === 'string';
}

function humanizePath(path: string): string {
  const cleanPath = path.split('?')[0]?.replace(/^\/+|\/+$/g, '') ?? '';
  const lastSegment = cleanPath.split('/').filter(Boolean).at(-1);

  if (!lastSegment) return siteMetadata.name;

  return lastSegment
    .replace(/^\[+|\]+$/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function inferRouteSection(path: string): RouteSection {
  if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
  if (path === '/home' || path === '/workspace' || path === '/settings') {
    return 'auth';
  }
  return 'public';
}

function inferRouteRobots(path: string, section: RouteSection): RouteRobots {
  if (section !== 'public') return { index: false, follow: false };
  if (path === '/login' || path.endsWith('/login')) {
    return { index: false, follow: false };
  }
  return { index: true, follow: true };
}

function toRouteDescriptor(input: RouteMetadataInput): RouteMetadataDescriptor {
  const section = input.section ?? inferRouteSection(input.path);
  const robots = input.robots ?? inferRouteRobots(input.path, section);
  const fallbackTitle = input.title ?? humanizePath(input.path);
  const fallbackDescription =
    input.description ??
    `${fallbackTitle} screen in the ${siteMetadata.name} application foundation.`;
  const fallbackAiPurpose =
    input.aiPurpose ??
    `${fallbackTitle} route generated from path-level metadata defaults.`;

  return {
    path: input.path,
    section,
    robots,
    locale: {
      en: {
        title: input.locale?.en?.title ?? fallbackTitle,
        description: input.locale?.en?.description ?? fallbackDescription,
        aiPurpose: input.locale?.en?.aiPurpose ?? fallbackAiPurpose,
      },
      tr: {
        title: input.locale?.tr?.title ?? fallbackTitle,
        description: input.locale?.tr?.description ?? fallbackDescription,
        aiPurpose: input.locale?.tr?.aiPurpose ?? fallbackAiPurpose,
      },
    },
  };
}

function resolveRouteDescriptor(route: MetadataRouteId | RouteMetadataInput) {
  return isMetadataRouteId(route)
    ? routeMetadata[route]
    : toRouteDescriptor(route);
}

export function getRouteMetadataDescriptor(routeId: MetadataRouteId) {
  return routeMetadata[routeId];
}

export function getIndexableRoutes() {
  return Object.values(routeMetadata).filter((route) => route.robots.index);
}

export function buildRootMetadata(
  locale: Locale = routing.defaultLocale,
): Metadata {
  const title =
    locale === 'tr'
      ? 'Tulpar | Next.js Uygulama Şablonu & Türk Kültür Atlası'
      : 'Tulpar | Next.js Application Template & Culture Atlas';

  return {
    metadataBase: siteMetadata.url,
    applicationName: siteMetadata.name,
    title: {
      default: title,
      template: `%s | ${siteMetadata.name}`,
    },
    description: siteMetadata.description,
    keywords: [...siteMetadata.keywords],
    authors: [{ name: siteMetadata.creator, url: siteMetadata.url }],
    creator: siteMetadata.creator,
    publisher: siteMetadata.publisher,
    category: 'technology',
    classification: 'application template',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        {
          url: siteMetadata.assets.icon16,
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: siteMetadata.assets.icon32,
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: siteMetadata.assets.icon48,
          sizes: '48x48',
          type: 'image/png',
        },
      ],
      shortcut: [
        {
          url: siteMetadata.assets.shortcutIcon,
          sizes: '48x48',
          type: 'image/x-icon',
        },
      ],
      apple: [
        {
          url: siteMetadata.assets.appleTouchIcon,
          sizes: '180x180',
          type: 'image/png',
        },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: siteMetadata.assets.icon48,
          color: '#5d5dff',
        },
      ],
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      siteName: siteMetadata.name,
      title,
      description: siteMetadata.description,
      url: '/',
      images: [
        {
          url: siteMetadata.assets.openGraph,
          width: 1024,
          height: 1024,
          alt: `${siteMetadata.name} application template brand symbol`,
        },
      ],
      locale,
      alternateLocale: routing.locales.filter((item) => item !== locale),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: siteMetadata.description,
      images: [siteMetadata.assets.openGraph],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      'ai:site_name': siteMetadata.name,
      'ai:summary': siteMetadata.aiSummary,
      'ai:llms-txt': absoluteUrl('/llms.txt'),
    },
  };
}

export function buildPageMetadata(
  route: MetadataRouteId | RouteMetadataInput,
  locale: Locale = routing.defaultLocale,
): Metadata {
  const descriptor = resolveRouteDescriptor(route);
  const localized = descriptor.locale[locale];
  const url = absoluteUrl(descriptor.path);
  const routeId = isMetadataRouteId(route) ? route : descriptor.path;

  return {
    title: localized.title,
    description: localized.description,
    alternates: {
      canonical: descriptor.path,
    },
    openGraph: {
      type: 'website',
      siteName: siteMetadata.name,
      title: localized.title,
      description: localized.description,
      url,
      images: [
        {
          url: siteMetadata.assets.openGraph,
          width: 1024,
          height: 1024,
          alt: `${siteMetadata.name} application template brand symbol`,
        },
      ],
      locale,
      alternateLocale: routing.locales.filter((item) => item !== locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: localized.title,
      description: localized.description,
      images: [siteMetadata.assets.openGraph],
    },
    robots: {
      index: descriptor.robots.index,
      follow: descriptor.robots.follow,
      nocache: !descriptor.robots.index,
      googleBot: {
        index: descriptor.robots.index,
        follow: descriptor.robots.follow,
        noimageindex: !descriptor.robots.index,
        'max-image-preview': descriptor.robots.index ? 'large' : 'none',
        'max-snippet': descriptor.robots.index ? -1 : 0,
        'max-video-preview': descriptor.robots.index ? -1 : 0,
      },
    },
    other: {
      'ai:route_id': routeId,
      'ai:section': descriptor.section,
      'ai:purpose': localized.aiPurpose,
      'ai:indexable': String(descriptor.robots.index),
    },
  };
}

export function buildDynamicPageMetadata(
  input: DynamicRouteMetadataInput,
  locale: Locale = routing.defaultLocale,
): Metadata {
  const descriptor = toRouteDescriptor({
    ...input,
    path: input.canonicalPath ?? input.path,
  });
  const metadata = buildPageMetadata(descriptor, locale);
  const imageUrl = input.image ? absoluteUrl(input.image) : undefined;

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: input.publishedTime || input.modifiedTime ? 'article' : 'website',
      images: imageUrl ? [{ url: imageUrl }] : metadata.openGraph?.images,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
    },
  };
}
