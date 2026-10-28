'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import PageShell from '../PageShell';
import Roulette from '../Roulette';
import CaseOdds from '../CaseOdds';
import { CASE_BY_ID } from '../../data/cases';
import styles from './styles.module.css';

export default function CaseDetail({ caseId }: { caseId: string }) {
  const caseDef = CASE_BY_ID[caseId];

  if (!caseDef) {
    return (
      <PageShell>
        <div className={styles.nf}>
          Такого кейса нет. <Link href="/cases">← вернуться к кейсам</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className={styles.head} style={{ '--c': caseDef.color } as CSSProperties}>
        <Link href="/cases" className={styles.back}>
          ← все кейсы
        </Link>
        <h1 className={styles.title}>{caseDef.name}</h1>
      </div>
      <Roulette caseDef={caseDef} />
      <div className={styles.odds}>
        <CaseOdds caseDef={caseDef} />
      </div>
    </PageShell>
  );
}
