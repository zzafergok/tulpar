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
      'classical Ottoman Iznik ceramic tile composition, vibrant glaze, intricate floral arabesque borders, museum masterpiece',
  },
  {
    id: 'tezhip_gold',
    label: 'Tezhip & Altın Varak',
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
    label: 'Epik Sinematik 3D',
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
    <Card className="border-tulpar-blue/40 bg-gradient-to-r from-obsidian via-void-black to-obsidian shadow-2xl">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-sm bg-tulpar-blue/20 p-2 text-tulpar-blue">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight text-titanium">
                Yapay Zeka (AI) Prompt Oluşturma Stüdyosu
              </h3>
              <p className="text-xs text-ash">
                Kartlardan renk ve sembol seçin, sanat tarzıyla birleştirip
                hazır görsel promptu üretin.
              </p>
            </div>
          </div>

          {hasSelection && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetSelection}
              className="h-8 text-xs text-ash hover:text-titanium"
            >
              <X className="mr-1 h-3 w-3" />
              Seçimleri Sıfırla
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-gunmetal/30 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase text-ash">
              Seçili Renk:
            </span>
            {selectedColor ? (
              <Badge
                variant="outline"
                className="gap-1.5 border-amber-500/40 font-mono text-xs text-amber-300"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                {selectedColor.nameTr} ({selectedColor.hex})
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs text-ash">
                Kartlardan renk seçin
              </Badge>
            )}
          </div>

          <div className="ml-2 flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase text-ash">
              Seçili Figür:
            </span>
            {selectedFigure ? (
              <Badge
                variant="outline"
                className="gap-1 border-sky-500/40 font-mono text-xs text-sky-300"
              >
                <Sparkles className="h-3 w-3" />
                {selectedFigure.nameTr}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs text-ash">
                Kartlardan figür seçin
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase text-ash">
            Sanat Tarzı Seçin:
          </span>
          <div className="flex flex-wrap gap-1.5">
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
                  className="h-7 text-xs"
                >
                  <Palette className="mr-1 h-3 w-3" />
                  {style.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-sm border border-gunmetal/40 bg-void-black/90 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-tulpar-blue">
                Oluşturulan Yapay Zeka Promptu (Midjourney / DALL-E / Gemini)
              </span>
              <p className="select-all break-all font-mono text-xs text-titanium/90">
                {generatedPrompt}
              </p>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={handleCopyPrompt}
              className="h-9 shrink-0 whitespace-nowrap text-xs font-bold"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-white" />
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
