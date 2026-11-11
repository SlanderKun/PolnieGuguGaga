import type { Bit, BitArray } from "./types";

export const BITS_IN_BYTE = 8;

export function emptyBitArray(byteCount: number): BitArray {
    return Array.from({ length: byteCount * BITS_IN_BYTE }, () => 0 as Bit);
}

export function randomBitArray(byteCount: number): BitArray {
    return Array.from(
        { length: byteCount * BITS_IN_BYTE },
        () => (Math.random() < 0.5 ? 0 : 1) as Bit,
    );
}
