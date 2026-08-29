'use client';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/core/button';
import { Input } from '@/components/core/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/core/tabs';
import type { ActiveCategoryFilter, CultureFilterState } from '../types';

interface FilterToolbarProps {
  filterState: CultureFilterState;
  onUpdateFilter: (updates: Partial<CultureFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const CATEGORY_TABS: Array<{ id: ActiveCategoryFilter; label: string }> = [
  { id: 'all', label: 'Tümü' },
  { id: 'colors', label: 'Renkler & Yönler' },
  { id: 'nature', label: 'Doğa & Ağaçlar' },
  { id: 'animals', label: 'Hayvanlar & Ongunlar' },
  { id: 'mythology', label: 'Mitoloji & Efsaneler' },
  { id: 'celestial', label: 'Göksel Simgeler' },
];

const DIRECTION_FILTERS = [
  { id: 'all', label: 'Tüm Yönler' },
  { id: 'east', label: '🧭 Doğu (Gök)' },
  { id: 'west', label: '🧭 Batı (Ak)' },
  { id: 'south', label: '🧭 Güney (Kızıl)' },
  { id: 'north', label: '🧭 Kuzey (Kara)' },
  { id: 'center', label: '🧭 Merkez (Sarı)' },
];

const IMPORTANCE_FILTERS = [
  { id: 'all', label: 'Tüm Seviyeler' },
  { id: 'very_high', label: '⭐ Çok Yüksek' },
  { id: 'high', label: '🔷 Yüksek' },
  { id: 'medium', label: '▫️ Orta' },
];

export function FilterToolbar({
  filterState,
  onUpdateFilter,
  onResetFilters,
  totalResults,
}: FilterToolbarProps) {
  const hasActiveFilters =
    Boolean(filterState.searchQuery) ||
    filterState.category !== 'all' ||
    filterState.direction !== 'all' ||
    filterState.importance !== 'all';

  return (
    <div className="space-y-3 rounded-sm border border-gunmetal/30 bg-obsidian/40 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-ash" />
          <Input
            value={filterState.searchQuery}
            onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
            placeholder="Renk, sembol, efsane, köken veya prompt ara (örn: Bozkurt, İznik, Şahmeran, #E30A17)..."
            className="pl-9 pr-8"
          />
          {filterState.searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onUpdateFilter({ searchQuery: '' })}
              className="absolute right-1 top-1 h-8 w-8 p-0 text-ash hover:text-titanium"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap font-mono text-xs text-ash">
            Sonuç: <strong className="text-titanium">{totalResults}</strong>{' '}
            kart
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-9 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Filtreleri Temizle
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filterState.category}
          onValueChange={(val) =>
            onUpdateFilter({ category: val as ActiveCategoryFilter })
          }
          className="w-full overflow-x-auto sm:w-auto"
        >
          <TabsList className="h-auto flex-wrap justify-start gap-1 p-1">
            {CATEGORY_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-3 py-1 text-[11px]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          {filterState.category === 'colors' && (
            <div className="flex items-center gap-1">
              <span className="mr-1 text-[10px] font-bold uppercase text-ash">
                Yön:
              </span>
              {DIRECTION_FILTERS.map((dir) => (
                <Button
                  key={dir.id}
                  variant={
                    filterState.direction === dir.id ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => onUpdateFilter({ direction: dir.id })}
                  className="h-7 px-2 text-[10px]"
                >
                  {dir.label}
                </Button>
              ))}
            </div>
          )}

          {filterState.category !== 'colors' && (
            <div className="flex items-center gap-1">
              <span className="mr-1 text-[10px] font-bold uppercase text-ash">
                Önem:
              </span>
              {IMPORTANCE_FILTERS.map((imp) => (
                <Button
                  key={imp.id}
                  variant={
                    filterState.importance === imp.id ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    onUpdateFilter({
                      importance: imp.id as CultureFilterState['importance'],
                    })
                  }
                  className="h-7 px-2 text-[10px]"
                >
                  {imp.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
