'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Button from '@mui/material/Button';
import ItemImage from '../ItemImage';
import CoinIcon from '../CoinIcon';
import { RARITIES } from '../../data/items';
import { fmt2 } from '../../lib/format';
import { useGame } from '../../lib/game-context';
import styles from './styles.module.css';

export default function Withdraw() {
  const { inventory } = useGame();
  const [selUids, setSelUids] = useState<string[]>([]);
  const [modal, setModal] = useState(false);

  const selected = useMemo(
    () => inventory.filter((x) => selUids.includes(x.uid)),
    [inventory, selUids]
  );
  const total = useMemo(() => selected.reduce((s, x) => s + x.value, 0), [selected]);

  const toggle = (uid: string) =>
    setSelUids((p) => (p.includes(uid) ? p.filter((u) => u !== uid) : [...p, uid]));

  return (
    <div>
      <h1 className={styles.title}>Вывод средств</h1>
      <p className={styles.lead}>Выбери шмотки для вывода и жми «Вывести».</p>

      {inventory.length === 0 ? (
        <div className={styles.empty}>Инвентарь пуст — выводить нечего. Иди крути кейсы.</div>
      ) : (
        <>
          <div className={styles.bar}>
            <div className={styles.barInfo}>
              Выбрано: {selected.length} шт · <CoinIcon size={14} />
              <span className={styles.sum}>{fmt2(total)}</span>
            </div>
            <Button
              variant="contained"
              disabled={selected.length === 0}
              className={styles.withdrawBtn}
              onClick={() => setModal(true)}
            >
              Вывести
            </Button>
          </div>

          <div className={styles.tiles}>
            {inventory.map((it) => (
              <button
                key={it.uid}
                type="button"
                onClick={() => toggle(it.uid)}
                className={`${styles.tile}${selUids.includes(it.uid) ? ` ${styles.tileActive}` : ''}`}
                style={{ '--c': RARITIES[it.def.rarity].color } as CSSProperties}
              >
                <ItemImage item={it.def} size={56} />
                <span className={styles.name}>{it.def.name}</span>
                <span className={styles.val}>{fmt2(it.value)}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.big}>А ещё чо</div>
              <div className={styles.small}>Вывод? В этом казике? Ну ты даёшь.</div>
              <Button variant="outlined" className={styles.ok} onClick={() => setModal(false)}>
                ну ладно
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
