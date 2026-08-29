'use client';

import * as React from 'react';
import { Check, Copy, Palette, Sparkles, Wand2, X } from 'lucide-react';

import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { Card, CardContent } from '@/components/core/card';
import {
  TURKISH_CULTURE_COLORS,
  TURKISH_CULTURE_FIGURES,
} from '@/constants/turkish-culture';
import type {
  ArtStyleConfig,
  ArtStyleOption,
  PromptStudioSelection,
} from '../types';

interface PromptStudioBarProps {
  selection: PromptStudioSelection;
  onUpdateSelection: (updates: Partial<PromptStudioSelection>) => void;
  onResetSelection: () => void;
}

const ART_STYLES: ArtStyleConfig[] = [
  {
    id: 'iznik_tile',
    label: 'İznik Çinisi',
    description: 'Klasik Osmanlı sırlı seramik ve kobalt çini estetiği',
    promptSuffix:
      'classical Ottoman Iznik ceramic tile composition, vibrant cobalt glaze, intricate floral arabesque borders, museum masterpiece',
  },
  {
    id: 'tezhip_gold',
    label: 'Tezhip & Altın',
    description: 'Saray fermanı tezhip ve varak altın işlemeciliği',
    promptSuffix:
      'royal Ottoman illumination manuscript art, 24k gold leaf filigree, fine imperial calligraphy framing, opulent details',
  },
  {
    id: 'kilim_woven',
    label: 'Kilim Dokuması',
    description: 'Anadolu Yörük ve Türkmen geometrik yün dokuma sanatı',
    promptSuffix:
      'authentic Anatolian tribal kilim textile pattern, rich woven woolen texture, geometric sacred totems, earthy rustic tones',
  },
  {
    id: 'miniature',
    label: 'Klasik Minyatür',
    description: 'Osmanlı nakkaşhane el yazması minyatür tarzı',
    promptSuffix:
      'classical Ottoman miniature painting style, Levni manuscript aesthetics, vibrant historical narrative, delicate gold accents',
  },
  {
    id: 'cinematic_3d',
    label: 'Epik 3D Sinematik',
    description: 'Dramatik hacimsel ışıklandırma ve modern render',
    promptSuffix:
      'epic cinematic fantasy 3D render, dramatic volumetric rim lighting, photorealistic textures, Unreal Engine 5, 8k resolution',
  },
];

export function PromptStudioBar({
  selection,
  onUpdateSelection,
  onResetSelection,
}: PromptStudioBarProps) {
  const [copied, setCopied] = React.useState(false);

  const selectedColor = TURKISH_CULTURE_COLORS.find(
    (c) => c.id === selection.selectedColorId,
  );
  const selectedFigure = TURKISH_CULTURE_FIGURES.find(
    (f) => f.id === selection.selectedFigureId,
  );
  const selectedStyle =
    ART_STYLES.find((s) => s.id === selection.artStyle) ?? ART_STYLES[0];

  const generatedPrompt = React.useMemo(() => {
    const parts: string[] = [];

    if (selectedFigure) {
      parts.push(selectedFigure.promptKeyword);
    } else {
      parts.push('mythical ancient Turkish cultural emblem');
    }

    if (selectedColor) {
      parts.push(`featuring ${selectedColor.promptKeyword}`);
    }

    parts.push(selectedStyle.promptSuffix);
    parts.push('--ar 16:9 --v 6.1 --style raw');

    return `/imagine prompt: ${parts.join(', ')}`;
  }, [selectedColor, selectedFigure, selectedStyle]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasSelection = Boolean(
    selection.selectedColorId || selection.selectedFigureId,
  );

  return (
    <Card className="relative overflow-hidden rounded-xl border border-tulpar-blue/30 bg-gradient-to-r from-card via-card/95 to-card/90 shadow-xl backdrop-blur-xl">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 bg-tulpar-blue/10 blur-2xl" />

      <CardContent className="relative z-10 space-y-4 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-tulpar-blue/40 bg-tulpar-blue/15 text-tulpar-blue shadow-inner">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-tight text-foreground">
                  Yapay Zeka (AI) Prompt Stüdyosu
                </h2>
                <Badge variant="outline" className="rounded-full border-tulpar-blue/30 bg-tulpar-blue/10 px-2 py-0 text-[10px] text-tulpar-blue font-mono">
                  LIVE STUDIO
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Kartlardan renk ve sembol seçin; sanat tarzını belirleyip anında üretim promptu oluşturun.
              </p>
            </div>
          </div>

          {hasSelection && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetSelection}
              className="h-8 rounded-full border-border/80 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Seçimleri Temizle
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Renk:
            </span>
            {selectedColor ? (
              <Badge
                variant="outline"
                className="gap-2 rounded-full border-tulpar-gold/50 bg-tulpar-gold/10 px-3 py-1 font-mono text-xs text-tulpar-gold shadow-sm"
              >
                <div
                  className="h-3 w-3 rounded-full border border-white/40 shadow-sm"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span>{selectedColor.nameTr}</span>
                <button
                  type="button"
                  onClick={() => onUpdateSelection({ selectedColorId: undefined })}
                  className="hover:opacity-75 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : (
              <span className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground/70">
                Aşağıdan renk seçin
              </span>
            )}
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Figür / Sembol:
            </span>
            {selectedFigure ? (
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-tulpar-blue/50 bg-tulpar-blue/10 px-3 py-1 font-mono text-xs text-tulpar-blue shadow-sm"
              >
                <Sparkles className="h-3 w-3 text-tulpar-blue" />
                <span>{selectedFigure.nameTr}</span>
                <button
                  type="button"
                  onClick={() => onUpdateSelection({ selectedFigureId: undefined })}
                  className="hover:opacity-75 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : (
              <span className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground/70">
                Aşağıdan figür seçin
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Sanat & Render Tarzı:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ART_STYLES.map((style) => {
              const isSelected = selection.artStyle === style.id;
              return (
                <Button
                  key={style.id}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    onUpdateSelection({ artStyle: style.id as ArtStyleOption })
                  }
                  className={`h-8 rounded-lg text-xs transition-all duration-200 ${
                    isSelected
                      ? 'bg-tulpar-blue text-white shadow-md shadow-tulpar-blue/20'
                      : 'border-border/70 hover:border-tulpar-blue/40'
                  }`}
                >
                  <Palette className="mr-1.5 h-3.5 w-3.5 opacity-80" />
                  {style.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-xl border border-border/80 bg-void-black/90 p-4 shadow-inner">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1">
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-tulpar-blue">
                <Sparkles className="h-3 w-3" />
                Midjourney / DALL-E / Gemini Promptu
              </span>
              <p className="select-all break-all font-mono text-xs text-titanium/90 leading-relaxed">
                {generatedPrompt}
              </p>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={handleCopyPrompt}
              className="h-9 shrink-0 rounded-lg bg-tulpar-blue px-4 text-xs font-bold text-white shadow-md hover:bg-tulpar-blue/90"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-signal-green" />
                  Kopyalandı!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Promptu Kopyala
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
