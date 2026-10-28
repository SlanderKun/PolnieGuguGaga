'use client';

import type { CSSProperties } from 'react';
import styles from './styles.module.css';

/** Логотип сайта (картинка из public/logo.png). */
export default function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <div className={styles.mark} style={{ '--size': `${size}px` } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="UpgraderOchkaOsla" className={styles.img} />
    </div>
  );
}
