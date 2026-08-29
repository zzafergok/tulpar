'use client';

import * as React from 'react';
import {
  Check,
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
  { bg: string; text: string; border: string; label: string; glow: string }
> = {
  nature: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Doğa & Ağaç',
    glow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/5',
  },
  animals: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    label: 'Hayvan & Ongun',
    glow: 'hover:border-sky-500/40 hover:shadow-sky-500/5',
  },
  mythology: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    label: 'Mitoloji & Efsane',
    glow: 'hover:border-rose-500/40 hover:shadow-rose-500/5',
  },
  celestial: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    label: 'Göksel Simge',
    glow: 'hover:border-amber-500/40 hover:shadow-amber-500/5',
  },
};

const IMPORTANCE_BADGES: Record<
  string,
  { label: string; variant: 'warning' | 'default' | 'secondary' }
> = {
  very_high: { label: 'Çok Yüksek', variant: 'warning' },
  high: { label: 'Yüksek', variant: 'default' },
  medium: { label: 'Orta', variant: 'secondary' },
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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        styleConfig.glow
      } ${
        isSelectedInStudio
          ? 'border-tulpar-blue ring-2 ring-tulpar-blue/50 shadow-lg shadow-tulpar-blue/10'
          : 'border-border/70 bg-card/75'
      }`}
    >
      <div>
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-110 ${styleConfig.border} ${styleConfig.bg} ${styleConfig.text}`}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-foreground transition-colors group-hover:text-tulpar-blue">
                {figure.nameTr}
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                {figure.nameEn}
              </p>
            </div>
          </div>

          <Badge
            variant={importanceConfig.variant}
            size="sm"
            className="rounded-full px-2 text-[10px]"
          >
            {importanceConfig.label}
          </Badge>
        </div>

        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              variant="outline"
              size="sm"
              className={`rounded-md border-border/60 bg-muted/30 px-2 text-[10px] ${styleConfig.text}`}
            >
              {styleConfig.label}
            </Badge>
            {figure.meanings.slice(0, 3).map((meaning) => (
              <Badge
                key={meaning}
                variant="secondary"
                size="sm"
                className="rounded-md px-2 text-[10px]"
              >
                {meaning}
              </Badge>
            ))}
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {figure.description}
          </p>

          <div className="rounded-md border border-border/40 bg-muted/20 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Köken: </span>
            <span className="line-clamp-1">{figure.origin}</span>
          </div>

          <div className="rounded-lg border border-border/60 bg-void-black/80 p-2.5 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <span className="line-clamp-1 font-mono text-[10px] text-muted-foreground">
                AI: <strong className="text-titanium">{figure.promptKeyword}</strong>
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

      <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2.5">
        {onSelectForStudio && (
          <Button
            variant={isSelectedInStudio ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectForStudio(figure)}
            className={`h-7 rounded-lg text-xs font-semibold ${
              isSelectedInStudio
                ? 'bg-tulpar-blue text-white'
                : 'border-border hover:border-tulpar-blue/40'
            }`}
          >
            <Sparkles className="mr-1 h-3 w-3" />
            {isSelectedInStudio ? 'Seçildi' : 'Stüdyoya Ekle'}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onInspect(figure)}
          className="h-7 rounded-lg text-xs text-muted-foreground hover:text-foreground"
        >
          <Eye className="mr-1 h-3 w-3" />
          İncele
        </Button>
      </div>
    </Card>
  );
}
