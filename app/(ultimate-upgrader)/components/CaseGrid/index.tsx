'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import CoinIcon from '../CoinIcon';
import { CASES } from '../../data/cases';
import { fmt } from '../../lib/format';
import styles from './styles.module.css';

export default function CaseGrid() {
  return (
    <div>
      <h1 className={styles.title}>Кейсы</h1>
      <div className={styles.grid}>
        {CASES.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ y: -5, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ '--c': c.color } as CSSProperties}
          >
            <Link href={`/cases/${c.id}`} className={styles.card}>
              <div className={styles.thumb}>КЕЙС</div>
              <div className={styles.name}>{c.name}</div>
              <div className={styles.blurb}>{c.blurb}</div>
              <div className={styles.priceRow}>
                <CoinIcon size={15} />
                <span className={styles.price}>{fmt(c.price)}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
