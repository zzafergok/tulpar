'use client';

import * as React from 'react';
import { Check, Compass, Copy, Eye, Sparkles } from 'lucide-react';

import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { Card, CardContent } from '@/components/core/card';
import type { TurkishCulturalColor } from '@/constants/turkish-culture';

interface ColorCardProps {
  color: TurkishCulturalColor;
  onInspect: (color: TurkishCulturalColor) => void;
  onSelectForStudio?: (color: TurkishCulturalColor) => void;
  isSelectedInStudio?: boolean;
}

const DIRECTION_LABELS: Record<string, { label: string; element: string }> = {
  east: { label: 'Doğu', element: 'Gök / Ağaç' },
  west: { label: 'Batı', element: 'Ak / Demir' },
  south: { label: 'Güney', element: 'Kızıl / Ateş' },
  north: { label: 'Kuzey', element: 'Kara / Su' },
  center: { label: 'Merkez', element: 'Sarı / Toprak' },
};

export function ColorCard({
  color,
  onInspect,
  onSelectForStudio,
  isSelectedInStudio,
}: ColorCardProps) {
  const [copiedHex, setCopiedHex] = React.useState(false);
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);

  const handleCopyHex = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color.hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1800);
  };

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color.promptKeyword);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  const isLightColor = [
    '#FFFFFF',
    '#F5F1E8',
    '#F4C430',
    '#E4B429',
    '#D4AF37',
    '#40E0D0',
  ].includes(color.hex.toUpperCase());

  const directionInfo = color.cosmologicalDirection
    ? DIRECTION_LABELS[color.cosmologicalDirection]
    : undefined;

  return (
    <Card
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelectedInStudio
          ? 'border-tulpar-gold ring-2 ring-tulpar-gold/50 shadow-lg shadow-tulpar-gold/10'
          : 'border-border/70 bg-card/75 hover:border-tulpar-blue/40'
      }`}
    >
      <div>
        <div
          className="relative h-32 w-full p-3.5 transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ backgroundColor: color.hex }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <div className="relative z-10 flex items-start justify-between">
            {directionInfo ? (
              <Badge
                variant="outline"
                className="gap-1 rounded-full border-white/30 bg-black/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm backdrop-blur-md"
              >
                <Compass className="h-3 w-3 text-tulpar-gold" />
                {directionInfo.label} • {directionInfo.element}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full border-white/20 bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md"
              >
                Kadim Türk Sanatı
              </Badge>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyHex}
              className="h-6 rounded-full border border-white/25 bg-black/40 px-2.5 font-mono text-[11px] font-bold text-white shadow-sm backdrop-blur-md hover:bg-black/60 active:scale-95"
            >
              {copiedHex ? (
                <>
                  <Check className="mr-1 h-3 w-3 text-signal-green" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3 opacity-80" />
                  {color.hex}
                </>
              )}
            </Button>
          </div>

          <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-end justify-between">
            <div>
              <span className="block text-lg font-black tracking-tight text-white drop-shadow-md">
                {color.nameTr}
              </span>
              <span className="font-mono text-xs text-white/80 drop-shadow">
                {color.nameEn}
              </span>
            </div>
            {color.historicalName && (
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
                {color.historicalName}
              </span>
            )}
          </div>
        </div>

        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-1">
            {color.meanings.slice(0, 3).map((meaning) => (
              <Badge
                key={meaning}
                variant="outline"
                size="sm"
                className="rounded-md border-border/60 bg-muted/30 px-2 text-[10px] text-muted-foreground"
              >
                {meaning}
              </Badge>
            ))}
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {color.description}
          </p>

          <div className="rounded-lg border border-border/60 bg-void-black/80 p-2.5 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <span className="line-clamp-1 font-mono text-[10px] text-muted-foreground">
                AI: <strong className="text-titanium">{color.promptKeyword}</strong>
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
            onClick={() => onSelectForStudio(color)}
            className={`h-7 rounded-lg text-xs font-semibold ${
              isSelectedInStudio
                ? 'bg-tulpar-gold text-slate-950 hover:bg-tulpar-gold/90'
                : 'border-border hover:border-tulpar-gold/40'
            }`}
          >
            <Sparkles className="mr-1 h-3 w-3" />
            {isSelectedInStudio ? 'Seçildi' : 'Stüdyoya Ekle'}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onInspect(color)}
          className="h-7 rounded-lg text-xs text-muted-foreground hover:text-foreground"
        >
          <Eye className="mr-1 h-3 w-3" />
          İncele
        </Button>
      </div>
    </Card>
  );
}
