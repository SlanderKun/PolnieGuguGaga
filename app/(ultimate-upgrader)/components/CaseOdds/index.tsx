'use client';

import type { CSSProperties } from 'react';
import ItemImage from '../ItemImage';
import CoinIcon from '../CoinIcon';
import { RARITIES } from '../../data/items';
import { casePool, type CaseDef } from '../../data/cases';
import { fmt2 } from '../../lib/format';
import styles from './styles.module.css';

export default function CaseOdds({ caseDef }: { caseDef: CaseDef }) {
  const pool = casePool(caseDef);
  const total = pool.reduce((s, i) => s + i.weight, 0);
  const rows = pool
    .map((it) => ({ it, chance: (it.weight / total) * 100 }))
    .sort((a, b) => b.it.value - a.it.value);

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Шансы выпадения</div>
      <div className={styles.grid}>
        {rows.map(({ it, chance }) => (
          <div key={it.id} className={styles.tile} style={{ '--c': RARITIES[it.rarity].color } as CSSProperties}>
            <ItemImage item={it} size={56} />
            <span className={styles.name}>{it.name}</span>
            <span className={styles.chance}>{chance.toFixed(3)}%</span>
            <span className={styles.priceRow}>
              <CoinIcon size={13} />
              <span className={styles.price}>{fmt2(it.value)}</span>
            </span>
          </div>
        ))}
      </div>
      <span className={styles.note}>
        Цена предмета — базовая; у выбитого экземпляра будет свой разброс ±20%.
      </span>
    </div>
  );
}
