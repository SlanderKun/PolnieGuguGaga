import type { Bit } from "./types";

export function randomK(n: number): Bit[] {
    const size = 1 << n;
    return Array.from({ length: size }, () => (Math.random() < 0.5 ? 0 : 1) as Bit);
}

export function randomData(n = 1): { n: number; k: Bit[] } {
    return { n, k: randomK(n) };
}
