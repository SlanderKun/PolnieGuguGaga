'use client';

import { AnimatePresence } from 'motion/react';
import ItemCard from '../ItemCard';
import CoinIcon from '../CoinIcon';
import { useGame } from '../../lib/game-context';
import { fmt2 } from '../../lib/format';
import styles from './styles.module.css';

export default function Inventory() {
  const { inventory, sellItem } = useGame();
  const total = inventory.reduce((s, x) => s + x.value, 0);

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.title}>
          Инвентарь <span className={styles.count}>({inventory.length})</span>
        </div>
        <div className={styles.total}>
          Всего: <CoinIcon size={15} />
          <span className={styles.totalValue}>{fmt2(total)}</span>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className={styles.empty}>
          Пусто как в холодильнике перед зарплатой.
          <br />
          Крути рулетку!
        </div>
      ) : (
        <div className={styles.grid}>
          <AnimatePresence>
            {inventory.map((it) => (
              <ItemCard key={it.uid} item={it} onSell={sellItem} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
