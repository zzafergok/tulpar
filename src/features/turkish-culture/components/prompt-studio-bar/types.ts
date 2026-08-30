import type { PromptStudioSelection } from '../../types';

export interface PromptStudioBarProps {
  selection: PromptStudioSelection;
  onUpdateSelection: (updates: Partial<PromptStudioSelection>) => void;
  onResetSelection: () => void;
}
