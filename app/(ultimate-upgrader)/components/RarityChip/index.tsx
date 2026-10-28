'use client';

import type { CSSProperties } from 'react';
import Chip from '@mui/material/Chip';
import { RARITIES, type RarityKey } from '../../data/items';
import styles from './styles.module.css';

export default function RarityChip({ rarity }: { rarity: RarityKey }) {
  return (
    <Chip
      label={RARITIES[rarity].name}
      size="small"
      className={styles.chip}
      style={{ '--c': RARITIES[rarity].color } as CSSProperties}
    />
  );
}
