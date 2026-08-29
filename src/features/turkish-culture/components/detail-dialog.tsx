'use client';

import * as React from 'react';
import { Check, Compass, Copy, Layers, Sparkles, Tag } from 'lucide-react';

import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/core/dialog';
import type { TurkishCulturalItem } from '@/constants/turkish-culture';

interface DetailDialogProps {
  item: TurkishCulturalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForStudio?: (item: TurkishCulturalItem) => void;
}

export function DetailDialog({
  item,
  isOpen,
  onClose,
  onSelectForStudio,
}: DetailDialogProps) {
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);
  const [copiedHex, setCopiedHex] = React.useState(false);

  if (!item) return null;

  const isColor = item.category === 'colors';

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.promptKeyword);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  const handleCopyHex = () => {
    if ('hex' in item) {
      navigator.clipboard.writeText(item.hex);
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 1800);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl border-gunmetal bg-obsidian p-6 sm:rounded-sm">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-tulpar-blue/40 text-tulpar-blue"
            >
              {isColor
                ? 'Türk Rengi & Kozmoloji'
                : `Kültür Sembolü (${item.category})`}
            </Badge>
            {'importance' in item && (
              <Badge variant="warning" size="sm">
                {item.importance === 'very_high'
                  ? 'Çok Yüksek Öncelik'
                  : item.importance === 'high'
                    ? 'Yüksek Öncelik'
                    : 'Orta Öncelik'}
              </Badge>
            )}
            {'cosmologicalDirection' in item && item.cosmologicalDirection && (
              <Badge variant="secondary" size="sm">
                <Compass className="mr-1 h-3 w-3" />
                Yön: {item.cosmologicalDirection.toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-titanium">
                {item.nameTr}
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-ash">
                {item.nameEn}
                {'historicalName' in item && item.historicalName
                  ? ` • Tarihsel Adı: ${item.historicalName}`
                  : ''}
              </DialogDescription>
            </div>

            {isColor && (
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded-sm border border-white/20 shadow-md"
                  style={{ backgroundColor: item.hex }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyHex}
                  className="font-mono text-xs"
                >
                  {copiedHex ? (
                    <Check className="mr-1 h-3 w-3 text-signal-green" />
                  ) : (
                    <Copy className="mr-1 h-3 w-3" />
                  )}
                  {item.hex}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="my-2 space-y-4 text-sm">
          <div className="space-y-1.5 rounded-sm border border-gunmetal/30 bg-void-black/60 p-4">
            <h4 className="flex items-center text-xs font-bold uppercase tracking-wider text-titanium">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              Kültürel & Mitolojik Anlatı
            </h4>
            <p className="text-xs leading-relaxed text-ash/90 sm:text-sm">
              {item.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 rounded-sm border border-gunmetal/20 bg-void-black/40 p-3">
              <h5 className="flex items-center text-[11px] font-bold uppercase tracking-wider text-ash">
                <Tag className="mr-1 h-3 w-3" />
                Sembolik Anlamlar
              </h5>
              <div className="flex flex-wrap gap-1">
                {item.meanings.map((meaning) => (
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
            </div>

            <div className="space-y-1.5 rounded-sm border border-gunmetal/20 bg-void-black/40 p-3">
              <h5 className="flex items-center text-[11px] font-bold uppercase tracking-wider text-ash">
                <Layers className="mr-1 h-3 w-3" />
                Tarihsel Köken & Alanlar
              </h5>
              <p className="text-xs text-ash/90">{item.origin}</p>
              {'usages' in item && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.usages.map((u) => (
                    <Badge
                      key={u}
                      variant="secondary"
                      size="sm"
                      className="text-[10px]"
                    >
                      {u}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 rounded-sm border border-tulpar-blue/30 bg-void-black/80 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center font-mono text-xs font-bold text-tulpar-blue">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Yapay Zeka (AI Prompt) Anahtar İfadesi
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="h-7 px-2 text-xs"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="mr-1 h-3 w-3 text-signal-green" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>
            <p className="select-all rounded-sm border border-gunmetal/30 bg-obsidian/70 p-2.5 font-mono text-xs text-titanium/90">
              {item.promptKeyword}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gunmetal/20 pt-4">
          {onSelectForStudio && (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onSelectForStudio(item);
                onClose();
              }}
              className="text-xs"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Prompt Stüdyosuna Aktar
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
