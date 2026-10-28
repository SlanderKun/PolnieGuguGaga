/** Целое число с разделителями (для счётчиков и цен кейсов). */
export function fmt(n: number): string {
  return Math.round(n).toLocaleString('ru-RU');
}

/** Деньги до сотой доли (две цифры после запятой). */
export function fmt2(n: number): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Инициалы-монограмма для временной заглушки предмета. */
export function monogram(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
