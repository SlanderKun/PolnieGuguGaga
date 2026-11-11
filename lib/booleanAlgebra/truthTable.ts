import type { Bit, TruthRow, TruthTable } from "./types";

export function buildTruthTable(n: number, k: Bit[]): TruthTable {
    const size = 1 << n;
    if (!Number.isInteger(n) || n < 1) {
        throw new Error(`N должно быть целым и >= 1 (получено ${n})`);
    }
    if (k.length !== size) {
        throw new Error(`Длина вектора K (${k.length}) должна быть равна 2^N = ${size}`);
    }

    const rows: TruthRow[] = [];
    for (let i = 0; i < size; i++) {
        const inputs: Bit[] = [];
        // старший бит — x1, младший — xn
        for (let bit = n - 1; bit >= 0; bit--) {
            inputs.push(((i >> bit) & 1) as Bit);
        }
        rows.push({ index: i, inputs });
    }

    return { n, k, rows };
}
