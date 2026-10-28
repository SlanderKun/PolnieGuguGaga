import { ItemDef, ITEM_BY_ID } from './items';

export interface CaseDef {
  id: string;
  name: string;
  price: number;
  color: string;
  blurb: string;
  itemIds: string[];
}

export const CASES: CaseDef[] = [
  {
    id: 'garazhi',
    name: 'За гаражами',
    price: 100,
    color: '#9ca3af',
    blurb: 'Днище, но душевно',
    itemIds: ['jumper', 'promo', 'semka', 'rezistor', 'musordrop', 'cryptorug', 'servo', 'upgrader2', 'redup'],
  },
  {
    id: 'payalka',
    name: 'Паяльная богадельня',
    price: 300,
    color: '#5e86ff',
    blurb: 'Запах канифоли',
    itemIds: ['rezistor', 'jumper', 'nano', 'servo', 'uno', 'payalnik', 'esp32', 'quantum'],
  },
  {
    id: 'zerkalo',
    name: 'Зеркало в 2 ночи',
    price: 500,
    color: '#e04bd9',
    blurb: 'Ты не он',
    itemIds: ['mewing', 'proteinpuk', 'guasha', 'bonesmash', 'canthal', 'mewprogress', 'phototilt', 'gigachad', 'genjackpot'],
  },
  {
    id: 'dno',
    name: 'Днище рейтинга',
    price: 800,
    color: '#9b59ff',
    blurb: 'Минус 25 ммр гарантировано',
    itemIds: ['zeromm', 'musordrop', 'upgrader2', 'aganim', 'crashout', 'rapira', 'starybog', 'pechat666'],
  },
  {
    id: 'exterminatus',
    name: 'Святой Экстерминатус',
    price: 1500,
    color: '#eb4b4b',
    blurb: 'Во славу Императора',
    itemIds: ['lasgun', 'bolter_empty', 'powerarmor', 'purity', 'bolter_emperor', 'primarch', 'throne'],
  },
  {
    id: 'night3am',
    name: '3 часа ночи',
    price: 2500,
    color: '#ffd84d',
    blurb: 'Мозг уже вытек',
    itemIds: ['skibidi', 'rizz', 'sigmawalk', 'patrik', 'crashout', 'godrizz', 'genjackpot', 'skibidi_omega'],
  },
  {
    id: 'otchayanie',
    name: 'Кейс отчаяния',
    price: 9999,
    color: '#ffd84d',
    blurb: 'Всё или подвал',
    itemIds: ['cryptorug', 'promo', 'nft', 'starybog', 'primarch', 'godrizz', 'throne', 'skibidi_omega', 'pechat666'],
  },
];

export const CASE_BY_ID: Record<string, CaseDef> = Object.fromEntries(CASES.map((c) => [c.id, c]));

export function casePool(c: CaseDef): ItemDef[] {
  return c.itemIds.map((id) => ITEM_BY_ID[id]).filter(Boolean);
}
