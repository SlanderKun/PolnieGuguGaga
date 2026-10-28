'use client';

import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Button from '@mui/material/Button';
import ItemImage from '../ItemImage';
import CoinIcon from '../CoinIcon';
import LoseOverlay from '../LoseOverlay';
import { ITEMS, ITEM_BY_ID, RARITIES } from '../../data/items';
import { fmt2 } from '../../lib/format';
import { useGame } from '../../lib/game-context';
import styles from './styles.module.css';

function chanceOf(inVal: number, outVal: number) {
  return Math.min(0.9, (inVal / outVal) * 0.9);
}

export default function Upgrade() {
  const { inventory, removeMany, addItem, toast } = useGame();
  const [selUids, setSelUids] = useState<string[]>([]);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [losePopup, setLosePopup] = useState(false);

  // выбранные предметы и суммарная ставка
  const selectedItems = useMemo(
    () => inventory.filter((x) => selUids.includes(x.uid)),
    [inventory, selUids]
  );
  const stakeValue = useMemo(
    () => selectedItems.reduce((s, x) => s + x.value, 0),
    [selectedItems]
  );
  const hasStake = selectedItems.length > 0;

  const target = targetId ? ITEM_BY_ID[targetId] : null;
  // цель валидна, только если дороже текущей ставки (иначе апать некуда)
  const effTarget = target && target.value > stakeValue ? target : null;

  const targets = useMemo(() => {
    if (!hasStake) return [];
    return ITEMS.filter((i) => i.value > stakeValue).sort((a, b) => a.value - b.value);
  }, [hasStake, stakeValue]);

  const chance = hasStake && effTarget ? chanceOf(stakeValue, effTarget.value) : 0;
  const winArcDeg = chance * 360;

  const toggleSel = useCallback((uid: string) => {
    setResult(null);
    setSelUids((prev) => (prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]));
  }, []);

  const spin = useCallback(() => {
    if (spinning || !hasStake || !effTarget) return;
    setSpinning(true);
    setResult(null);

    const win = Math.random() < chance;
    const arc = chance * 360;
    const half = arc / 2;
    let landing: number;
    if (win) {
      landing = 180 + (Math.random() * 2 - 1) * half * 0.9; // внутри нижней зоны
    } else {
      const loseHalf = (360 - arc) / 2 - 4; // зона проигрыша вокруг верхней точки
      const o = (Math.random() * 2 - 1) * Math.max(1, loseHalf);
      landing = (o + 360) % 360;
    }

    setAngle((prev) => {
      const cur = ((prev % 360) + 360) % 360;
      const delta = ((landing - cur + 360) % 360) + 360 * 6;
      return prev + delta;
    });

    const stakedUids = [...selUids];
    const targetLocal = effTarget;
    const count = selectedItems.length;
    setTimeout(() => {
      if (win) {
        removeMany(stakedUids);
        addItem(targetLocal);
        setResult('win');
        toast(`АПНУЛ! ${targetLocal.name}`, 'success');
      } else {
        removeMany(stakedUids);
        setResult('lose');
        setLosePopup(true);
        toast(`Сгорело ${count} шт… F`, 'error');
      }
      setSelUids([]);
      setTargetId(null);
      setSpinning(false);
    }, 4300);
  }, [spinning, hasStake, effTarget, chance, selUids, selectedItems.length, removeMany, addItem, toast]);

  return (
    <div className={styles.grid}>
      <div className={styles.wheelPanel}>
        <div className={styles.wheel}>
          <div className={styles.anchor} />
          <div
            className={styles.ring}
            style={{ '--arc': `${winArcDeg}deg`, '--win': '#22c55e', '--track': '#1b2130' } as CSSProperties}
          />
          <div className={styles.hole} />
          <div
            className={styles.needleWrap}
            style={{
              transform: `rotate(${angle}deg)`,
              transition: spinning ? 'transform 4.2s cubic-bezier(0.1,0.7,0.1,1)' : 'none',
            }}
          >
            <div className={styles.needle} />
          </div>
          <div className={styles.center}>
            <div className={styles.centerDisc}>
              <AnimatePresence mode="wait">
                {result === 'win' ? (
                  <motion.span key="w" className={styles.win} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    АП!
                  </motion.span>
                ) : result === 'lose' ? (
                  <motion.span key="l" className={styles.lose} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    F
                  </motion.span>
                ) : (
                  <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className={styles.pct}>{(chance * 100).toFixed(3)}%</div>
                    <div className={styles.pctSub}>шанс апа</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Button
          onClick={spin}
          disabled={spinning || !hasStake || !effTarget}
          variant="contained"
          color="secondary"
          className={styles.spinBtn}
          component={motion.button}
          whileTap={{ scale: 0.95 }}
        >
          {spinning ? 'АПАЕМ…' : 'АПГРЕЙД'}
        </Button>
        {hasStake && effTarget && (
          <div className={styles.mult}>
            x{(effTarget.value / stakeValue).toFixed(2)} к ставке · проигрыш = всё сгорает
          </div>
        )}
      </div>

      <div className={styles.choose}>
        <div>
          <div className={styles.label}>1. Выбери что апать (можно несколько)</div>
          {hasStake && (
            <div className={styles.stake}>
              Ставка: {selectedItems.length} шт · <CoinIcon size={13} /> {fmt2(stakeValue)}
            </div>
          )}
          {inventory.length === 0 ? (
            <div className={styles.placeholder}>Сначала накрути шмоток в рулетке</div>
          ) : (
            <div className={`${styles.tiles} ${styles.tilesSel}`}>
              {inventory.map((it) => (
                <button
                  key={it.uid}
                  type="button"
                  disabled={spinning}
                  onClick={() => toggleSel(it.uid)}
                  className={`${styles.tile}${selUids.includes(it.uid) ? ` ${styles.tileActive}` : ''}`}
                  style={{ '--c': RARITIES[it.def.rarity].color } as CSSProperties}
                >
                  <ItemImage item={it.def} size={52} />
                  <span className={styles.tileName}>{it.def.name}</span>
                  <span className={styles.tileVal}>{fmt2(it.value)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className={styles.label}>2. Выбери во что апнуть</div>
          {!hasStake ? (
            <div className={styles.placeholder}>Сначала выбери шмотки сверху</div>
          ) : targets.length === 0 ? (
            <div className={styles.placeholder}>Ставка уже дороже всего — апать некуда</div>
          ) : (
            <div className={`${styles.tiles} ${styles.tilesTgt}`}>
              {targets.map((t) => {
                const ch = chanceOf(stakeValue, t.value);
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={spinning}
                    onClick={() => {
                      setTargetId(t.id);
                      setResult(null);
                    }}
                    className={`${styles.tile}${targetId === t.id ? ` ${styles.tileActive}` : ''}`}
                    style={{ '--c': RARITIES[t.rarity].color } as CSSProperties}
                  >
                    <ItemImage item={t} size={52} />
                    <span className={styles.tileName}>{t.name}</span>
                    <span className={styles.tileChance}>{(ch * 100).toFixed(3)}%</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <LoseOverlay open={losePopup} onClose={() => setLosePopup(false)} />
    </div>
  );
}
