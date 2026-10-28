'use client';

import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Button from '@mui/material/Button';
import ItemImage from '../ItemImage';
import CoinIcon from '../CoinIcon';
import { RARITIES, randItem, rollValue, weightedPick, type ItemDef } from '../../data/items';
import { casePool, type CaseDef } from '../../data/cases';
import { fmt, fmt2 } from '../../lib/format';
import { useGame } from '../../lib/game-context';
import styles from './styles.module.css';

const CELL = 120;
const GAP = 8;
const STRIDE = CELL + GAP;
const REEL_LEN = 64;
const WIN_INDEX = 56;

interface Win {
  def: ItemDef;
  value: number;
  spin: number;
}

export default function Roulette({ caseDef }: { caseDef: CaseDef }) {
  const { spend, reserveSpin, commitSpin, toast } = useGame();
  const pool = casePool(caseDef);

  // Детерминированная стартовая лента (без Math.random в рендере) — иначе SSR и клиент
  // сгенерируют разные ленты и получится ошибка гидрации. Рандом — только в спине.
  const [reel, setReel] = useState<ItemDef[]>(() =>
    Array.from({ length: REEL_LEN }, (_, i) => pool[i % pool.length])
  );
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<Win | null>(null);
  const spinCount = useRef(0);
  const viewRef = useRef<HTMLDivElement>(null);

  const spin = useCallback(() => {
    if (spinning) return;
    if (!spend(caseDef.price)) {
      toast('Недостаточно ГУГАкоинов!', 'error');
      return;
    }
    setLastWin(null);
    setSpinning(true);

    const winner = weightedPick(pool);
    const value = rollValue(winner);
    reserveSpin(winner, value); // персист: если обновить страницу во время крутки — предмет не потеряется
    const newReel = Array.from({ length: REEL_LEN }, () => randItem(pool));
    newReel[WIN_INDEX] = winner;
    setReel(newReel);

    setAnimating(false);
    setOffset(0);

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const vw = viewRef.current?.offsetWidth ?? 800;
        const jitter = (Math.random() * 2 - 1) * (CELL * 0.33);
        const target = -(WIN_INDEX * STRIDE + STRIDE / 2 - vw / 2) + jitter;
        setAnimating(true);
        setOffset(target);
      })
    );

    setTimeout(() => {
      commitSpin(winner, value);
      spinCount.current += 1;
      setLastWin({ def: winner, value, spin: spinCount.current });
      setSpinning(false);
      toast(`Выпало: ${winner.name} (${fmt2(value)})`, 'success');
    }, 5400);
  }, [spinning, spend, caseDef.price, pool, reserveSpin, commitSpin, toast]);

  // Быстрая крутка: без анимации ленты, сразу результат.
  const quickSpin = useCallback(() => {
    if (spinning) return;
    if (!spend(caseDef.price)) {
      toast('Недостаточно ГУГАкоинов!', 'error');
      return;
    }
    const winner = weightedPick(pool);
    const value = rollValue(winner);
    commitSpin(winner, value);
    spinCount.current += 1;
    setLastWin({ def: winner, value, spin: spinCount.current });
    toast(`Выпало: ${winner.name} (${fmt2(value)})`, 'success');
  }, [spinning, spend, caseDef.price, pool, commitSpin, toast]);

  return (
    <div className={styles.wrap}>
      <div className={styles.viewport}>
        <div className={styles.pointerLine} />
        <div className={styles.pointerTri} />
        <div ref={viewRef} className={styles.track}>
          <div
            className={styles.strip}
            style={{
              transform: `translate3d(${offset}px,0,0)`,
              transition: animating ? 'transform 5.2s cubic-bezier(0.12,0.75,0.12,1)' : 'none',
            }}
          >
            {reel.map((it, i) => (
              <div key={i} className={styles.cell} style={{ '--c': RARITIES[it.rarity].color } as CSSProperties}>
                <ItemImage item={it} size={64} />
                <span className={styles.cellName}>{it.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resultSlot}>
        <AnimatePresence>
          {lastWin && (
            <motion.div
              key={lastWin.spin}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={styles.result}
              style={{ '--c': RARITIES[lastWin.def.rarity].color } as CSSProperties}
            >
              <ItemImage item={lastWin.def} size={40} />
              <div>
                <div className={styles.resultName}>{lastWin.def.name}</div>
                <div className={styles.resultValRow}>
                  <CoinIcon size={14} />
                  <span className={styles.resultVal}>{fmt2(lastWin.value)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.btnRow}>
        <Button
          onClick={spin}
          disabled={spinning}
          size="large"
          variant="contained"
          className={styles.spinBtn}
          component={motion.button}
          whileTap={{ scale: 0.95 }}
        >
          {spinning ? (
            'КРУТИТСЯ…'
          ) : (
            <span className={styles.spinInner}>
              КРУТИТЬ ЗА {fmt(caseDef.price)} <CoinIcon size={18} />
            </span>
          )}
        </Button>
        <Button
          onClick={quickSpin}
          disabled={spinning}
          size="large"
          variant="outlined"
          className={styles.fastBtn}
          component={motion.button}
          whileTap={{ scale: 0.95 }}
        >
          БЫСТРО
        </Button>
      </div>
      <span className={styles.hint}>Чем реже шмотка — тем меньше шанс. Но ты же везучий, да?</span>
    </div>
  );
}
