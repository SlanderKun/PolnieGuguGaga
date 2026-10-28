'use client';

import NextLink from 'next/link';
import Button from '@mui/material/Button';
import BrandMark from '../BrandMark';
import CoinIcon from '../CoinIcon';
import { useGame } from '../../lib/game-context';
import { fmt2 } from '../../lib/format';
import styles from './styles.module.css';

export default function Header() {
  const { balance } = useGame();
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <BrandMark size={120} />
        <div>
          <div className={styles.title}>
            Upgrader<span className={styles.accent}>OchkaOsla</span>
          </div>
          <div className={styles.sub}>честный апгрейдер* (нет)</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.balance}>
          <CoinIcon />
          <span className={styles.balValue}>{fmt2(balance)}</span>
        </div>
        <Button component={NextLink} href="/" color="inherit" variant="outlined">
          домой
        </Button>
      </div>
    </header>
  );
}
