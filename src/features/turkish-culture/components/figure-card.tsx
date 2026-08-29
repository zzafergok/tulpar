'use client';

import * as React from 'react';
import {
  Bird,
  Check,
  Compass,
  Copy,
  Crown,
  Eye,
  Flame,
  Moon,
  Sparkles,
  TreePine,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { Card, CardContent } from '@/components/core/card';
import type { TurkishCulturalFigure } from '@/constants/turkish-culture';

interface FigureCardProps {
  figure: TurkishCulturalFigure;
  onInspect: (figure: TurkishCulturalFigure) => void;
  onSelectForStudio?: (figure: TurkishCulturalFigure) => void;
  isSelectedInStudio?: boolean;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  nature: TreePine,
  animals: Crown,
  mythology: Flame,
  celestial: Moon,
};

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  nature: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Doğa & Bitki',
  },
  animals: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    label: 'Hayvan & Ongun',
  },
  mythology: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    label: 'Mitoloji & Efsane',
  },
  celestial: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    label: 'Göksel Simge',
  },
};

const IMPORTANCE_BADGES: Record<
  string,
  { label: string; variant: 'warning' | 'default' | 'secondary' }
> = {
  very_high: { label: 'Çok Yüksek Öncelik', variant: 'warning' },
  high: { label: 'Yüksek Öncelik', variant: 'default' },
  medium: { label: 'Orta Öncelik', variant: 'secondary' },
};

export function FigureCard({
  figure,
  onInspect,
  onSelectForStudio,
  isSelectedInStudio,
}: FigureCardProps) {
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(figure.promptKeyword);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  const IconComponent = CATEGORY_ICONS[figure.category] ?? Sparkles;
  const styleConfig =
    CATEGORY_STYLES[figure.category] ?? CATEGORY_STYLES.nature;
  const importanceConfig =
    IMPORTANCE_BADGES[figure.importance] ?? IMPORTANCE_BADGES.medium;

  return (
    <Card
      className={`group relative flex flex-col justify-between overflow-hidden border-gunmetal/30 bg-obsidian/70 transition-all duration-300 hover:border-tulpar-blue/50 hover:shadow-xl ${
        isSelectedInStudio ? 'border-amber-400 ring-2 ring-amber-400' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between border-b border-gunmetal/20 bg-void-black/60 p-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-sm border ${styleConfig.border} ${styleConfig.bg} ${styleConfig.text}`}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black uppercase tracking-tight text-titanium transition-colors group-hover:text-tulpar-blue">
                {figure.nameTr}
              </span>
              <p className="font-mono text-xs text-ash">{figure.nameEn}</p>
            </div>
          </div>

          <Badge
            variant={importanceConfig.variant}
            size="sm"
            className="text-[10px]"
          >
            {importanceConfig.label}
          </Badge>
        </div>

        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              size="sm"
              className={`border-gunmetal/40 text-[10px] ${styleConfig.text}`}
            >
              {styleConfig.label}
            </Badge>
            {figure.meanings.slice(0, 3).map((meaning) => (
              <Badge
                key={meaning}
                variant="secondary"
                size="sm"
                className="text-[10px]"
              >
                {meaning}
              </Badge>
            ))}
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-ash">
            {figure.description}
          </p>

          <div className="rounded-sm border border-gunmetal/30 bg-void-black/60 p-2 text-[11px] text-ash/80">
            <span className="font-semibold text-titanium/90">Köken: </span>
            <span className="line-clamp-1">{figure.origin}</span>
          </div>

          <div className="rounded-sm border border-gunmetal/20 bg-void-black/90 p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="line-clamp-1 font-mono text-[10px] text-ash/80">
                Prompt: {figure.promptKeyword}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPrompt}
                className="h-5 px-1.5 text-[10px] text-tulpar-blue hover:text-tulpar-blue/80"
              >
                {copiedPrompt ? (
                  <Check className="h-3 w-3 text-signal-green" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="flex items-center justify-between border-t border-gunmetal/20 bg-void-black/40 px-4 py-2.5">
        {onSelectForStudio ? (
          <Button
            variant={isSelectedInStudio ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectForStudio(figure)}
            className="h-7 text-xs"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            {isSelectedInStudio ? 'Seçildi' : 'Stüdyoya Ekle'}
          </Button>
        ) : (
          <span className="font-mono text-[10px] text-ash/60">
            {figure.subType}
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onInspect(figure)}
          className="h-7 text-xs text-ash hover:text-titanium"
        >
          <Eye className="mr-1 h-3 w-3" />
          İncele
        </Button>
      </div>
    </Card>
  );
}
