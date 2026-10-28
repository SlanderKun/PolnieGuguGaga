'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';
import { ITEM_BY_ID, rollValue, type ItemDef } from '../data/items';
import { fmt2, uid } from './format';

export interface InvItem {
  uid: string;
  def: ItemDef;
  /** Индивидуальная ценность этого экземпляра (с разбросом). */
  value: number;
}

interface GameContextValue {
  balance: number;
  inventory: InvItem[];
  addBalance: (n: number) => void;
  spend: (n: number) => boolean;
  /** Добавить предмет. Если value не задан — ценность бросается случайно. */
  addItem: (d: ItemDef, value?: number) => void;
  removeItem: (u: string) => void;
  /** Удалить несколько предметов разом (мультиставка в апгрейде). */
  removeMany: (uids: string[]) => void;
  /** Старт крутки: зарезервировать победителя в localStorage (чтобы не потерять при перезагрузке). */
  reserveSpin: (d: ItemDef, value: number) => void;
  /** Конец крутки: выдать зарезервированный предмет и снять резерв. */
  commitSpin: (d: ItemDef, value: number) => void;
  /** Заменить предмет (апгрейд). Ценность нового экземпляра бросается заново. */
  replaceItem: (u: string, d: ItemDef) => void;
  sellItem: (u: string) => void;
  reset: () => void;
  toast: (msg: string, severity?: AlertColor) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const STORAGE_KEY = 'upgrader_save';
const PENDING_KEY = 'upgrader_pending';

export function GameProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1000);
  const [inventory, setInventory] = useState<InvItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const balanceRef = useRef(balance);

  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: AlertColor }>({
    open: false,
    msg: '',
    sev: 'info',
  });

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let inv: InvItem[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          balance: number;
          inv: { uid: string; id: string; value?: number }[];
        };
        if (typeof data.balance === 'number') setBalance(data.balance);
        if (Array.isArray(data.inv)) {
          inv = data.inv
            .filter((x) => ITEM_BY_ID[x.id])
            .map((x) => ({
              uid: x.uid,
              def: ITEM_BY_ID[x.id],
              value: typeof x.value === 'number' ? x.value : ITEM_BY_ID[x.id].value,
            }));
        }
      }
    } catch {}
    // Незавершённая крутка (страницу обновили во время анимации) — выдать предмет сразу.
    try {
      const praw = localStorage.getItem(PENDING_KEY);
      if (praw) {
        const pd = JSON.parse(praw) as { id: string; value?: number };
        const def = ITEM_BY_ID[pd?.id];
        if (def) {
          inv = [{ uid: uid(), def, value: typeof pd.value === 'number' ? pd.value : def.value }, ...inv];
        }
        localStorage.removeItem(PENDING_KEY);
      }
    } catch {}
    if (inv.length) setInventory(inv);
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          balance,
          inv: inventory.map((x) => ({ uid: x.uid, id: x.def.id, value: x.value })),
        })
      );
    } catch {}
  }, [balance, inventory, loaded]);

  const toast = useCallback((msg: string, severity: AlertColor = 'info') => {
    setSnack({ open: true, msg, sev: severity });
  }, []);

  const addBalance = useCallback((n: number) => {
    balanceRef.current = Math.round((balanceRef.current + n) * 100) / 100;
    setBalance((b) => Math.round((b + n) * 100) / 100);
  }, []);

  const spend = useCallback((n: number) => {
    if (balanceRef.current < n) return false;
    balanceRef.current = Math.round((balanceRef.current - n) * 100) / 100;
    setBalance((b) => Math.round((b - n) * 100) / 100);
    return true;
  }, []);

  const addItem = useCallback((d: ItemDef, value?: number) => {
    const v = value ?? rollValue(d);
    setInventory((inv) => [{ uid: uid(), def: d, value: v }, ...inv]);
  }, []);

  const reserveSpin = useCallback((d: ItemDef, value: number) => {
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify({ id: d.id, value }));
    } catch {}
  }, []);

  const commitSpin = useCallback((d: ItemDef, value: number) => {
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch {}
    setInventory((inv) => [{ uid: uid(), def: d, value }, ...inv]);
  }, []);

  const removeItem = useCallback((u: string) => {
    setInventory((inv) => inv.filter((x) => x.uid !== u));
  }, []);

  const removeMany = useCallback((uids: string[]) => {
    const set = new Set(uids);
    setInventory((inv) => inv.filter((x) => !set.has(x.uid)));
  }, []);

  const replaceItem = useCallback((u: string, d: ItemDef) => {
    setInventory((inv) => inv.map((x) => (x.uid === u ? { uid: x.uid, def: d, value: rollValue(d) } : x)));
  }, []);

  const sellItem = useCallback(
    (u: string) => {
      setInventory((inv) => {
        const it = inv.find((x) => x.uid === u);
        if (it) {
          addBalance(it.value);
          setSnack({ open: true, msg: `Продано за ${fmt2(it.value)}`, sev: 'success' });
        }
        return inv.filter((x) => x.uid !== u);
      });
    },
    [addBalance]
  );

  const reset = useCallback(() => {
    balanceRef.current = 1000;
    setBalance(1000);
    setInventory([]);
    setSnack({ open: true, msg: 'Жизнь с чистого листа', sev: 'info' });
  }, []);

  const value: GameContextValue = {
    balance,
    inventory,
    addBalance,
    spend,
    addItem,
    reserveSpin,
    commitSpin,
    removeItem,
    removeMany,
    replaceItem,
    sellItem,
    reset,
    toast,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={2600}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.sev}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ fontWeight: 700 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
