'use client';

import { useState, type CSSProperties } from 'react';
import { RARITIES, type ItemDef } from '../../data/items';
import { ITEM_IMAGES } from '../../data/itemImages';
import { monogram } from '../../lib/format';
import styles from './styles.module.css';

const DEFAULT_IMG = '/items/_default.png';

/**
 * Иконка предмета. Источник берётся из манифеста ITEM_IMAGES (точный файл, без 404):
 *  1) картинка предмета (если есть в манифесте)
 *  2) дефолтная заглушка _default.png
 *  3) монограмма по редкости (если даже дефолт не загрузился)
 */
export default function ItemImage({ item, size = 72 }: { item: ItemDef; size?: number }) {
  const own = ITEM_IMAGES[item.id];
  const sources = own ? [own, DEFAULT_IMG] : [DEFAULT_IMG];

  const [idx, setIdx] = useState(0);
  // сброс перебора при смене предмета (ячейки ленты переиспользуются)
  const [lastId, setLastId] = useState(item.id);
  if (item.id !== lastId) {
    setLastId(item.id);
    setIdx(0);
  }

  const vars = { '--size': `${size}px`, '--c': RARITIES[item.rarity].color } as CSSProperties;
  const src = idx < sources.length ? sources[idx] : null;

  return (
    <div className={styles.box} style={vars} aria-label={item.name}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={item.name}
          className={styles.img}
          loading="lazy"
          onError={() => setIdx((i) => i + 1)}
        />
      ) : (
        <>
          <span className={styles.mono}>{monogram(item.name)}</span>
          <span className={styles.tag}>IMG</span>
        </>
      )}
    </div>
  );
}
