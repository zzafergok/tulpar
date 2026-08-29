'use client';

import * as React from 'react';
import {
  Compass,
  Crown,
  Flame,
  Layers,
  Palette,
  Sparkles,
  TreePine,
} from 'lucide-react';

import { Badge } from '@/components/core/badge';
import { Card, CardContent } from '@/components/core/card';
import { getCulturalStatistics } from '@/constants/turkish-culture';
import type { ActiveCategoryFilter } from '../types';

interface HeroStatsProps {
  activeCategory: ActiveCategoryFilter;
  onSelectCategory: (category: ActiveCategoryFilter) => void;
}

export function HeroStats({
  activeCategory,
  onSelectCategory,
}: HeroStatsProps) {
  const stats = getCulturalStatistics();

  const statCards = [
    {
      id: 'colors' as const,
      label: 'Kozmoloji & Sanat Renkleri',
      value: stats.totalColors,
      subtitle: '4 Yön, Merkez & Saray Tonları',
      icon: Palette,
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderGlow: 'hover:border-amber-400/60',
      activeRing:
        'border-amber-400 ring-1 ring-amber-400/50 shadow-amber-500/10',
      iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      badge: '16 Renk',
      badgeVariant: 'warning' as const,
    },
    {
      id: 'nature' as const,
      label: 'Doğa, Ağaç & Çiçekler',
      value: 10,
      subtitle: 'Hayat Ağacı, Lale, Gül, Çınar',
      icon: TreePine,
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderGlow: 'hover:border-emerald-400/60',
      activeRing:
        'border-emerald-400 ring-1 ring-emerald-400/50 shadow-emerald-500/10',
      iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badge: '10 Motif',
      badgeVariant: 'secondary' as const,
    },
    {
      id: 'animals' as const,
      label: 'Hayvanlar & Savaşçı Totemleri',
      value: 14,
      subtitle: 'Bozkurt, Tulpar, Kartal, Koç',
      icon: Crown,
      gradient: 'from-sky-500/20 via-sky-500/5 to-transparent',
      borderGlow: 'hover:border-sky-400/60',
      activeRing: 'border-sky-400 ring-1 ring-sky-400/50 shadow-sky-500/10',
      iconBox: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      badge: '14 Ongun',
      badgeVariant: 'default' as const,
    },
    {
      id: 'mythology' as const,
      label: 'Mitoloji & Destan Varlıkları',
      value: stats.totalMythological,
      subtitle: 'Şahmeran, Hüma, Zümrüdüanka',
      icon: Flame,
      gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
      borderGlow: 'hover:border-rose-400/60',
      activeRing: 'border-rose-400 ring-1 ring-rose-400/50 shadow-rose-500/10',
      iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      badge: '6 Efsane',
      badgeVariant: 'destructive' as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-card/60 p-6 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/40 sm:p-8">
        <div className="bg-tulpar-blue/15 pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-tulpar-gold/15 pointer-events-none absolute -bottom-12 left-1/4 h-56 w-56 rounded-full blur-3xl" />
        <div className="bg-tulpar-firuze/10 pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-tulpar-blue/50 bg-tulpar-blue/10 text-tulpar-blue gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-wide shadow-sm"
            >
              <Layers className="text-tulpar-blue h-3.5 w-3.5" />
              TULPAR • NEXT.JS 16 ENTERPRISE ŞABLONU
            </Badge>
            <Badge
              variant="outline"
              className="border-tulpar-gold/40 bg-tulpar-gold/10 text-tulpar-gold gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-wide shadow-sm"
            >
              <Sparkles className="text-tulpar-gold h-3.5 w-3.5" />
              ÖĞRETİCİ REFERANS VİTRİNİ • TÜRK KÜLTÜR ATLASI
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-sky-500/40 bg-sky-500/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-sky-400 shadow-sm"
            >
              <Compass className="h-3.5 w-3.5" />4 YÖN RENK KOZMOLOJİSİ
            </Badge>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Tulpar Kültürü & Mitoloji Bilgi Kartları
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Bu şablonu indirip projelerinde kullanacak geliştiricilere kadim
              Türk kültürünü, renk kozmolojisini ve modern Next.js mimarisini
              öğretmek amacıyla hazırlanmış referans vitrin. Göktürk
              kozmolojisinden Selçuklu taş oymalarına 40+ otantik renk,
              mitolojik sembol ve Yapay Zeka (AI Prompt) stüdyosu içeren
              uygulama temeli.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeCategory === card.id;

          return (
            <Card
              key={card.id}
              onClick={() => onSelectCategory(card.id)}
              className={`group relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                card.borderGlow
              } ${
                isSelected
                  ? card.activeRing
                  : 'border-border/60 bg-card/70 hover:bg-card'
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  isSelected ? 'opacity-100' : ''
                }`}
              />

              <CardContent className="relative z-10 p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {card.label}
                    </p>
                    <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                      {card.value}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground/80">
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-110 ${card.iconBox}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <Badge
                      variant={card.badgeVariant}
                      size="sm"
                      className="rounded-full px-2"
                    >
                      {card.badge}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
