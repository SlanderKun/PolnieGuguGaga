'use client';

import type { ReactNode } from 'react';
import Header from '../Header';
import CheatBar from '../CheatBar';
import Nav from '../Nav';
import Inventory from '../Inventory';
import styles from './styles.module.css';

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Header />
        <div className={styles.cheat}>
          <CheatBar />
        </div>
        <Nav />
        <div className={styles.content}>{children}</div>
        <div className={styles.inventory}>
          <Inventory />
        </div>
        <span className={styles.footer}>
          *Не настоящие деньги. Не настоящие шмотки. Не настоящая удача. Сделано по фану.
        </span>
        <span className={styles.donate}>А можно разрабу задонить хотя бы на пачку кириешек.</span>
      </div>
    </div>
  );
}
