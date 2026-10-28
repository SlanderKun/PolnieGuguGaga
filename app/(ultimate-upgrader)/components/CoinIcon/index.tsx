'use client';

import type { CSSProperties } from 'react';
import styles from './styles.module.css';

/** Заглушка монеты (валюта). */
export default function CoinIcon({ size = 20 }: { size?: number }) {
  return (
    <span className={styles.coin} style={{ '--size': `${size}px` } as CSSProperties}>
      G
    </span>
  );
}
