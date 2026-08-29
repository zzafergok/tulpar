'use client';

import {
  Compass,
  Crown,
  Flame,
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
      label: 'Kozmolojik & Sanat Renkleri',
      value: stats.totalColors,
      subtitle: '4 Yön, Merkez ve Saray Tonları',
      icon: Palette,
      accentColor: 'text-amber-400',
      badge: '16 Renk',
      badgeVariant: 'warning' as const,
    },
    {
      id: 'nature' as const,
      label: 'Doğa, Ağaç & Çiçekler',
      value: 10,
      subtitle: 'Hayat Ağacı, Lale, Gül, Çınar',
      icon: TreePine,
      accentColor: 'text-emerald-400',
      badge: '10 Motif',
      badgeVariant: 'secondary' as const,
    },
    {
      id: 'animals' as const,
      label: 'Hayvanlar & Savaşçı Totemleri',
      value: 14,
      subtitle: 'Bozkurt, Kartal, At, Koç Boynuzu',
      icon: Crown,
      accentColor: 'text-sky-400',
      badge: '14 Ongun',
      badgeVariant: 'default' as const,
    },
    {
      id: 'mythology' as const,
      label: 'Mitoloji & Destan Varlıkları',
      value: stats.totalMythological,
      subtitle: 'Şahmeran, Hüma, Zümrüdüanka, Tepegöz',
      icon: Flame,
      accentColor: 'text-rose-400',
      badge: '6 Efsane',
      badgeVariant: 'destructive' as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-sm border border-gunmetal/40 bg-gradient-to-br from-obsidian via-obsidian/90 to-void-black p-6 shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-tulpar-blue/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-amber-300"
              >
                <Sparkles className="mr-1.5 h-3 w-3" />
                Tulpar • Kadim Türk Kültür Atlası
              </Badge>
              <Badge
                variant="outline"
                className="border-sky-500/40 bg-sky-500/10 text-sky-300"
              >
                <Compass className="mr-1.5 h-3 w-3" />Gök Tengri 4 Yön & Renk Kozmolojisi
              </Badge>
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-titanium sm:text-3xl">
              Tulpar Kültürü & Mitolojisi Bilgi Kartları
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-ash">
              Göktürk yön kozmolojisinden Selçuklu taş oymalarına, İznik
              çinilerinden Dede Korkut efsanelerine uzanan 40+ otantik renk,
              kutsal sembol ve mitolojik figürün detaylı görsel, anlamsal ve
              Yapay Zeka (AI Prompt) rehberi.
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
              className={`cursor-pointer transition-all duration-200 hover:border-tulpar-blue/50 hover:bg-obsidian/80 ${
                isSelected
                  ? 'border-tulpar-blue bg-obsidian ring-1 ring-tulpar-blue'
                  : 'border-gunmetal/30 bg-obsidian/60'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ash">
                      {card.label}
                    </p>
                    <p className="text-2xl font-black tracking-tight text-titanium">
                      {card.value}
                    </p>
                    <p className="line-clamp-1 text-xs text-ash/80">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`rounded-sm bg-void-black/70 p-2 ${card.accentColor}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant={card.badgeVariant} size="sm">
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
