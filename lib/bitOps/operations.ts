import type { Bit, BitArray } from "./types";

export function setBit(arr: BitArray, index: number, value: Bit): BitArray {
    if (!Number.isInteger(index) || index < 0 || index >= arr.length) {
        throw new Error(`Индекс бита ${index} вне диапазона 0..${arr.length - 1}`);
    }
    const copy = arr.slice();
    copy[index] = value;
    return copy;
}

export function toggleBit(arr: BitArray, index: number): BitArray {
    return setBit(arr, index, arr[index] === 1 ? 0 : 1);
}

function zip(a: BitArray, b: BitArray, fn: (x: Bit, y: Bit) => number): BitArray {
    if (a.length !== b.length) {
        throw new Error(`Длины шкал не совпадают: ${a.length} и ${b.length}`);
    }
    return a.map((bit, i) => (fn(bit, b[i]) ? 1 : 0) as Bit);
}

export function union(a: BitArray, b: BitArray): BitArray {
    return zip(a, b, (x, y) => x | y);
}

export function intersection(a: BitArray, b: BitArray): BitArray {
    return zip(a, b, (x, y) => x & y);
}

export function difference(a: BitArray, b: BitArray): BitArray {
    return zip(a, b, (x, y) => (x === 1 && y === 0 ? 1 : 0));
}

export function symmetricDifference(a: BitArray, b: BitArray): BitArray {
    return zip(a, b, (x, y) => x ^ y);
}

export function bitsToString(arr: BitArray): string {
    const bytes: string[] = [];
    for (let i = 0; i < arr.length; i += 8) {
        bytes.push(arr.slice(i, i + 8).join(""));
    }
    return bytes.join(" ");
}
