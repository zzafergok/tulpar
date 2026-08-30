'use client';

/**
 * Tulpar Kültür Tasarım Sistemi Renk Tanımları:
 * - bg-tulpar-blue / text-tulpar-blue: Göktürk Mavisi (Hayvan & Ongun)
 * - bg-tulpar-firuze / text-tulpar-firuze: İznik Firuzesi (Doğa & Ağaç)
 * - bg-tulpar-gold / text-tulpar-gold: Hakan Altını (Göksel Simge & Önem Rozetleri)
 * - bg-alert-red / text-alert-red: Kök Boya Kızılı (Mitoloji & Efsane)
 */

import * as React from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Crown,
  Eye,
  Flame,
  Landmark,
  Moon,
  Plus,
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

const CATEGORY_CONFIG: Record<
  string,
  { icon: LucideIcon; label: string; accentColor: string; topAccentBg: string }
> = {
  nature: {
    icon: TreePine,
    label: 'Doğa & Ağaç',
    accentColor: 'text-tulpar-firuze',
    topAccentBg: 'bg-tulpar-firuze',
  },
  animals: {
    icon: Crown,
    label: 'Hayvan & Ongun',
    accentColor: 'text-tulpar-blue',
    topAccentBg: 'bg-tulpar-blue',
  },
  mythology: {
    icon: Flame,
    label: 'Mitoloji & Efsane',
    accentColor: 'text-alert-red',
    topAccentBg: 'bg-alert-red',
  },
  celestial: {
    icon: Moon,
    label: 'Göksel Simge',
    accentColor: 'text-tulpar-gold',
    topAccentBg: 'bg-tulpar-gold',
  },
};

const IMPORTANCE_CONFIG: Record<string, { label: string; badgeStyle: string }> = {
  very_high: {
    label: '⭐ Çok Yüksek',
    badgeStyle: 'bg-tulpar-gold/10 text-tulpar-gold border-tulpar-gold/30',
  },
  high: {
    label: '🔷 Yüksek',
    badgeStyle: 'bg-tulpar-gold/10 text-tulpar-gold/90 border-tulpar-gold/20',
  },
  medium: {
    label: '▫️ Orta',
    badgeStyle: 'bg-muted/60 text-muted-foreground border-border/50',
  },
};

export function FigureCard({
  figure,
  onInspect,
  onSelectForStudio,
  isSelectedInStudio,
}: FigureCardProps) {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(figure.promptKeyword);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  const config = CATEGORY_CONFIG[figure.category] ?? CATEGORY_CONFIG.nature;
  const IconComponent = config.icon;
  const importance = IMPORTANCE_CONFIG[figure.importance] ?? {
    label: '▫️ Kültürel',
    badgeStyle: 'bg-muted/60 text-muted-foreground border-border/50',
  };

  return (
    <Card
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card/95 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-950/90 ${
        isSelectedInStudio
          ? 'border-tulpar-blue ring-2 ring-tulpar-blue/50 shadow-lg shadow-tulpar-blue/10'
          : 'border-border/70 hover:border-border'
      }`}
    >
      <div>
        <div className={`h-0.5 w-full ${config.topAccentBg} opacity-60`} />

        <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/60 shadow-sm dark:bg-zinc-900">
              <IconComponent className={`h-4 w-4 ${config.accentColor}`} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black uppercase tracking-tight text-foreground transition-colors group-hover:text-tulpar-blue">
                {figure.nameTr}
              </h3>
              <p className="truncate font-mono text-[11px] text-muted-foreground/80">
                {figure.nameEn}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            size="sm"
            className={`shrink-0 rounded-md font-mono text-[10px] font-semibold ${importance.badgeStyle}`}
          >
            {importance.label}
          </Badge>
        </div>

        <CardContent className="space-y-3 p-4">
          <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
            {figure.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              size="sm"
              className="rounded-md border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {config.label}
            </Badge>
            {figure.meanings.slice(0, 3).map((meaning) => (
              <Badge
                key={meaning}
                variant="secondary"
                size="sm"
                className="rounded-md bg-muted/40 px-2 py-0.5 text-[10px] font-normal text-muted-foreground/90"
              >
                {meaning}
              </Badge>
            ))}
          </div>

          <div
            title={figure.origin}
            className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
          >
            <Landmark className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
            <span className="font-medium text-foreground/80">Köken:</span>
            <span className="truncate flex-1 text-muted-foreground/90">{figure.origin}</span>
          </div>

          <div className="border-t border-border/30 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrompt(!showPrompt)}
              className="h-6 w-full justify-between rounded-md px-2 text-[11px] font-medium text-muted-foreground opacity-75 transition-opacity hover:opacity-100 hover:text-tulpar-blue"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-tulpar-blue/80" />
                AI Üretim Promptu
              </span>
              {showPrompt ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>

            {showPrompt && (
              <div className="mt-2 rounded-lg border border-border/70 bg-void-black/90 p-2.5 shadow-inner">
                <div className="flex items-center justify-between gap-2">
                  <span className="line-clamp-2 font-mono text-[10px] text-titanium/90">{figure.promptKeyword}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPrompt}
                    className="h-6 shrink-0 px-2 text-[10px] text-tulpar-blue hover:text-tulpar-blue/80"
                  >
                    {copiedPrompt ? <Check className="h-3 w-3 text-signal-green" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/50 bg-muted/20 p-3">
        {onSelectForStudio && (
          <Button
            variant={isSelectedInStudio ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectForStudio(figure)}
            className={`h-8 flex-1 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 ${
              isSelectedInStudio
                ? 'bg-tulpar-blue text-white hover:bg-tulpar-blue/90'
                : 'border-border/80 bg-background/80 text-foreground hover:border-tulpar-blue/40 hover:bg-muted'
            }`}
          >
            {isSelectedInStudio ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Seçildi
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-3.5 w-3.5 text-tulpar-blue" />
                Stüdyoya Ekle
              </>
            )}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onInspect(figure)}
          className="h-8 rounded-lg border-border/80 bg-background/80 px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          İncele
        </Button>
      </div>
    </Card>
  );
}
