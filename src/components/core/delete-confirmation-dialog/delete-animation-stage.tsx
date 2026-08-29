'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DeletePhase } from './types';
import styles from './delete-confirmation-dialog.module.css';

interface DeleteAnimationStageProps {
  itemName: string;
  upperEntityLabel: string;
  phase: DeletePhase;
  dialogCopy: {
    deleting: string;
    deletingStatus: string;
    movingToTrashText: string;
    completingText: string;
  };
}

export function DeleteAnimationStage({
  itemName,
  upperEntityLabel,
  phase,
  dialogCopy,
}: DeleteAnimationStageProps) {
  return (
    <div
      className={styles.animationStage}
      role="status"
      aria-live="polite"
      aria-label={`${itemName} ${dialogCopy.deleting}`}
    >
      <div
        className={cn(
          styles.paper,
          phase === 'crumpling' && styles.paperCrumpling,
          phase === 'tossing' && styles.paperTossing,
          phase === 'waiting' && styles.paperWaiting,
        )}
        aria-hidden="true"
      >
        <span className={styles.paperLabel}>{dialogCopy.deletingStatus}</span>
        <strong>{itemName}</strong>
        <span>{upperEntityLabel}</span>
      </div>

      <div
        className={cn(
          styles.trashTarget,
          (phase === 'tossing' || phase === 'waiting') &&
            styles.trashTargetVisible,
          phase === 'waiting' && styles.trashTargetWaiting,
        )}
        aria-hidden="true"
      >
        <Trash2 className="h-8 w-8" />
      </div>

      <p className={styles.animationStatus}>
        {phase === 'waiting'
          ? dialogCopy.completingText
          : dialogCopy.movingToTrashText}
      </p>
    </div>
  );
}
