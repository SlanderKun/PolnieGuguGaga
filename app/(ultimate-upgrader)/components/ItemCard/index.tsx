'use client';

import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import ItemImage from '../ItemImage';
import CoinIcon from '../CoinIcon';
import RarityChip from '../RarityChip';
import { RARITIES } from '../../data/items';
import { fmt2 } from '../../lib/format';
import type { InvItem } from '../../lib/game-context';
import styles from './styles.module.css';

export default function ItemCard({ item, onSell }: { item: InvItem; onSell: (u: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={styles.card}
      style={{ '--c': RARITIES[item.def.rarity].color } as CSSProperties}
    >
      <ItemImage item={item.def} size={76} />
      <div className={styles.name} title={item.def.name}>
        {item.def.name}
      </div>
      <RarityChip rarity={item.def.rarity} />
      <div className={styles.valueRow}>
        <CoinIcon size={16} />
        <span className={styles.value}>{fmt2(item.value)}</span>
      </div>
      <Button size="small" fullWidth color="inherit" className={styles.sell} onClick={() => onSell(item.uid)}>
        Продать
      </Button>
    </motion.div>
  );
}
