'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './styles.module.css';

/**
 * Полноэкранное всплытие картинки при проигрыше.
 * Картинку положи в public/lose.png — она подхватится сама.
 * Пока файла нет — показывается заглушка с подсказкой.
 */
export default function LoseOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.box}
            initial={{ scale: 0.6, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            {imgError ? (
              <div className={styles.placeholder}>
                <div>
                  <div className={styles.ph1}>СГОРЕЛО</div>
                  <div className={styles.ph2}>
                    Положи свою картинку в
                    <br />
                    <span className={styles.code}>public/lose.png</span>
                  </div>
                </div>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/lose.png" alt="Проигрыш" className={styles.img} onError={() => setImgError(true)} />
            )}
            <div className={styles.hint}>нажми, чтобы закрыть</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
