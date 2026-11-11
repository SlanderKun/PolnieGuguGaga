export type Bit = 0 | 1;

export interface TruthRow {
    index: number;
    inputs: Bit[];
}

export interface TruthTable {
    n: number;
    k: Bit[];
    rows: TruthRow[];
}

export interface Literal {
    varIndex: number;
    negated: boolean;
}

export type Clause = Literal[];

export interface NormalForm {
    type: "SDNF" | "SKNF";
    clauses: Clause[];
}
