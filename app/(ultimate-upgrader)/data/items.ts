export type RarityKey = 'shir' | 'common' | 'rare' | 'legend' | 'mythic' | 'noname';

export interface Rarity {
  name: string;
  color: string;
}

// Редкости — каноничная гамма CS:GO
export const RARITIES: Record<RarityKey, Rarity> = {
  shir: { name: 'Ширпотреб', color: '#9ca3af' },
  common: { name: 'Обычное', color: '#5e86ff' },
  rare: { name: 'Редкое', color: '#9b59ff' },
  legend: { name: 'Легендарное', color: '#e04bd9' },
  mythic: { name: 'Мифическое', color: '#eb4b4b' },
  noname: { name: 'НОНЕЙМ', color: '#ffd84d' },
};

export interface ItemDef {
  id: string;
  name: string;
  value: number;
  rarity: RarityKey;
  weight: number;
}

const W: Record<RarityKey, number> = {
  shir: 42,
  common: 22,
  rare: 9,
  legend: 3,
  mythic: 0.8,
  noname: 0.15,
};

const mk = (id: string, name: string, value: number, rarity: RarityKey, weight?: number): ItemDef => ({
  id,
  name,
  value,
  rarity,
  weight: weight ?? W[rarity],
});

export const ITEMS: ItemDef[] = [
  // ---------- Ширпотреб ----------
  mk('rezistor', 'Резистор на 220 Ом', 5, 'shir'),
  mk('jumper', 'Джампер без контакта', 4, 'shir'),
  mk('semka', 'Семка в кармане куртки', 6, 'shir'),
  mk('skibidi', 'Скибиди-туалет с засором', 10, 'shir'),
  mk('mewing', 'Гайд по мьюингу от 12-летнего', 7, 'shir'),
  mk('promo', 'Промокод минус 0.01%', 6, 'shir'),
  mk('lasgun', 'Лазган без заряда', 8, 'shir'),
  mk('zeromm', '0 ммр за Старого Бога', 9, 'shir'),
  mk('proteinpuk', 'Протеиновый пук', 5, 'shir'),
  mk('cryptorug', 'Крипта минус 98 процентов', 3, 'shir'),
  // ---------- Обычное ----------
  mk('nano', 'Ардуино Нано с Али', 40, 'common'),
  mk('servo', 'Сервопривод-дёргалка', 35, 'common'),
  mk('bonesmash', 'Бонсмэш об косяк', 45, 'common'),
  mk('guasha', 'Гуаша из пятёрочки', 30, 'common'),
  mk('musordrop', 'Мусорный дроп за 300 часов', 28, 'common'),
  mk('rizz', 'Риз на донышке', 50, 'common'),
  mk('bolter_empty', 'Болтер холостой', 52, 'common'),
  mk('sigmawalk', 'Сигма-уолкинг в школу', 38, 'common'),
  mk('nft', 'NFT-обезьяна банкрот', 42, 'common'),
  mk('energos', 'Энергос на кассе', 33, 'common'),
  // ---------- Редкое ----------
  mk('uno', 'Ардуино Уно горелый', 150, 'rare'),
  mk('payalnik', 'Паяльник T12 обжёг палец', 180, 'rare'),
  mk('canthal', 'Кантал-тилт кустарный', 240, 'rare'),
  mk('upgrader2', 'Апгрейдер х2 слился', 130, 'rare'),
  mk('aganim', 'Аганим на 40 минуте', 210, 'rare'),
  mk('patrik', 'Сигма уровня Патрик Бэйтман', 160, 'rare'),
  mk('powerarmor', 'Силовой доспех ржавый', 230, 'rare'),
  mk('mewprogress', 'Мьюинг-прогресс за 3 года', 170, 'rare'),
  mk('crashout', 'Крашаут в маршрутке', 140, 'rare'),
  // ---------- Легендарное ----------
  mk('esp32', 'ESP32 с вайфаем соседа', 650, 'legend'),
  mk('phototilt', 'Кантал-тилт в фотошопе', 900, 'legend'),
  mk('redup', 'Красный апгрейд х10', 820, 'legend'),
  mk('rapira', 'Божественная рапира слил', 1100, 'legend'),
  mk('gigachad', 'Гигачад-челюсть на филлерах', 700, 'legend'),
  mk('bolter_emperor', 'Болтер Императора', 950, 'legend'),
  mk('purity', 'Печать чистоты', 780, 'legend'),
  // ---------- Мифическое ----------
  mk('quantum', 'Квантовый Ардуино не существует', 2600, 'mythic'),
  mk('genjackpot', 'Генетический джекпот', 3200, 'mythic'),
  mk('starybog', 'Старый Бог собственной персоной', 3800, 'mythic'),
  mk('primarch', 'Примарх во плоти', 3500, 'mythic'),
  mk('godrizz', 'Ризз уровня бог', 2800, 'mythic'),
  // ---------- НОНЕЙМ ----------
  mk('skibidi_omega', 'Скибиди Сигма Ризз Омега Охайо', 13000, 'noname'),
  mk('pechat666', 'Печать Старого Бога 666 ммр', 20000, 'noname'),
  mk('throne', 'Золотой Трон Императора', 25000, 'noname'),
];

export const ITEM_BY_ID: Record<string, ItemDef> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export function randItem(pool: ItemDef[]): ItemDef {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function weightedPick(pool: ItemDef[]): ItemDef {
  const total = pool.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const it of pool) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return pool[pool.length - 1];
}

/**
 * Каждый экземпляр предмета получает свой разброс ценности (±~20%)
 * относительно базовой стоимости. Значение — до сотой.
 */
export function rollValue(def: ItemDef): number {
  const factor = 0.82 + Math.random() * 0.4; // 0.82 .. 1.22
  return Math.round(def.value * factor * 100) / 100;
}
