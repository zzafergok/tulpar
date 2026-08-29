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
      className={`group relative flex flex-col justify-between overflow-hidden border-gunmetal/30 bg-obsidian/70 transition-all duration-300 hover:border-tulpar-blue/50 hover:shadow-xl ${
        isSelectedInStudio ? 'border-amber-400 ring-2 ring-amber-400' : ''
      }`}
    >
      <div>
        <div
          className="relative h-28 w-full p-3 transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ backgroundColor: color.hex }}
        >
          <div className="flex items-start justify-between">
            {directionInfo ? (
              <Badge
                variant="outline"
                className={`font-mono text-[10px] font-bold ${
                  isLightColor
                    ? 'border-black/30 bg-black/20 text-black'
                    : 'border-white/30 bg-white/20 text-white'
                }`}
              >
                <Compass className="mr-1 h-3 w-3" />
                {directionInfo.label} ({directionInfo.element})
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  isLightColor
                    ? 'border-black/20 bg-black/10 text-black'
                    : 'border-white/20 bg-white/10 text-white'
                }`}
              >
                Geleneksel Sanat
              </Badge>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyHex}
              className={`h-7 px-2 font-mono text-xs font-bold transition-transform active:scale-95 ${
                isLightColor
                  ? 'bg-black/20 text-black hover:bg-black/30'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {copiedHex ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  {color.hex}
                </>
              )}
            </Button>
          </div>

          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
            <span
              className={`text-lg font-black tracking-tight ${
                isLightColor ? 'text-black' : 'text-white'
              }`}
            >
              {color.nameTr}
            </span>
            <span
              className={`font-mono text-xs opacity-90 ${
                isLightColor ? 'text-black' : 'text-white'
              }`}
            >
              {color.nameEn}
            </span>
          </div>
        </div>

        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {color.historicalName && (
              <Badge variant="secondary" size="sm" className="text-[10px]">
                {color.historicalName}
              </Badge>
            )}
            {color.meanings.slice(0, 3).map((meaning) => (
              <Badge
                key={meaning}
                variant="outline"
                size="sm"
                className="border-gunmetal/40 text-[10px] text-ash"
              >
                {meaning}
              </Badge>
            ))}
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-ash">
            {color.description}
          </p>

          <div className="rounded-sm border border-gunmetal/20 bg-void-black/80 p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="line-clamp-1 font-mono text-[10px] text-ash/80">
                AI Prompt: {color.promptKeyword}
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
            onClick={() => onSelectForStudio(color)}
            className="h-7 text-xs"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            {isSelectedInStudio ? 'Seçildi' : 'Stüdyoya Ekle'}
          </Button>
        ) : (
          <span className="text-[10px] text-ash/60">
            {color.usages.slice(0, 2).join(', ')}
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onInspect(color)}
          className="h-7 text-xs text-ash hover:text-titanium"
        >
          <Eye className="mr-1 h-3 w-3" />
          İncele
        </Button>
      </div>
    </Card>
  );
}
