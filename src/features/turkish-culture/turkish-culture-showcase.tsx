'use client';

import * as React from 'react';
import { SearchX } from 'lucide-react';

import { Button } from '@/components/core/button';
import {
  filterCulturalItems,
  type TurkishCulturalColor,
  type TurkishCulturalFigure,
  type TurkishCulturalItem,
} from '@/constants/turkish-culture';
import { ColorCard } from './components/color-card';
import { DetailDialog } from './components/detail-dialog';
import { FigureCard } from './components/figure-card';
import { FilterToolbar } from './components/filter-toolbar';
import { HeroStats } from './components/hero-stats';
import { PromptStudioBar } from './components/prompt-studio-bar';
import type {
  ActiveCategoryFilter,
  CultureFilterState,
  PromptStudioSelection,
  TurkishCultureShowcaseProps,
} from './types';

const INITIAL_FILTER_STATE: CultureFilterState = {
  searchQuery: '',
  category: 'all',
  importance: 'all',
  direction: 'all',
};

const INITIAL_PROMPT_STUDIO: PromptStudioSelection = {
  selectedColorId: 'gok-mavisi',
  selectedFigureId: 'tulpar',
  artStyle: 'iznik_tile',
};

export function TurkishCultureShowcase({
  initialCategory = 'all',
  className = '',
}: TurkishCultureShowcaseProps) {
  const [filterState, setFilterState] = React.useState<CultureFilterState>({
    ...INITIAL_FILTER_STATE,
    category: initialCategory,
  });

  const [promptSelection, setPromptSelection] =
    React.useState<PromptStudioSelection>(INITIAL_PROMPT_STUDIO);

  const [inspectedItem, setInspectedItem] =
    React.useState<TurkishCulturalItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleUpdateFilter = (updates: Partial<CultureFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState(INITIAL_FILTER_STATE);
  };

  const handleInspect = (item: TurkishCulturalItem) => {
    setInspectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSelectForStudio = (item: TurkishCulturalItem) => {
    if (item.category === 'colors') {
      setPromptSelection((prev) => ({
        ...prev,
        selectedColorId: prev.selectedColorId === item.id ? undefined : item.id,
      }));
    } else {
      setPromptSelection((prev) => ({
        ...prev,
        selectedFigureId:
          prev.selectedFigureId === item.id ? undefined : item.id,
      }));
    }
  };

  const filteredItems = React.useMemo(() => {
    return filterCulturalItems({
      searchQuery: filterState.searchQuery,
      category: filterState.category,
      importance: filterState.importance,
      direction: filterState.direction,
    });
  }, [filterState]);

  return (
    <div className={`space-y-6 ${className}`}>
      <HeroStats
        activeCategory={filterState.category}
        onSelectCategory={(cat: ActiveCategoryFilter) =>
          handleUpdateFilter({ category: cat })
        }
      />

      <PromptStudioBar
        selection={promptSelection}
        onUpdateSelection={(updates) =>
          setPromptSelection((prev) => ({ ...prev, ...updates }))
        }
        onResetSelection={() =>
          setPromptSelection({
            selectedColorId: undefined,
            selectedFigureId: undefined,
            artStyle: 'iznik_tile',
          })
        }
      />

      <FilterToolbar
        filterState={filterState}
        onUpdateFilter={handleUpdateFilter}
        onResetFilters={handleResetFilters}
        totalResults={filteredItems.length}
      />

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-gunmetal/50 bg-obsidian/30 py-16 text-center">
          <SearchX className="mb-3 h-10 w-10 text-ash/40" />
          <h4 className="text-base font-bold uppercase tracking-tight text-titanium">
            Eşleşen Bilgi Kartı Bulunamadı
          </h4>
          <p className="mb-4 mt-1 max-w-md text-xs text-ash">
            Arama terimlerinizi veya seçtiğiniz kategori/önem filtrelerini
            değiştirerek tekrar deneyebilirsiniz.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Filtreleri Sıfırla
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => {
            if (item.category === 'colors') {
              const colorItem = item as TurkishCulturalColor;
              return (
                <ColorCard
                  key={colorItem.id}
                  color={colorItem}
                  onInspect={handleInspect}
                  onSelectForStudio={handleSelectForStudio}
                  isSelectedInStudio={
                    promptSelection.selectedColorId === colorItem.id
                  }
                />
              );
            }

            const figureItem = item as TurkishCulturalFigure;
            return (
              <FigureCard
                key={figureItem.id}
                figure={figureItem}
                onInspect={handleInspect}
                onSelectForStudio={handleSelectForStudio}
                isSelectedInStudio={
                  promptSelection.selectedFigureId === figureItem.id
                }
              />
            );
          })}
        </div>
      )}

      <DetailDialog
        item={inspectedItem}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelectForStudio={handleSelectForStudio}
      />
    </div>
  );
}
