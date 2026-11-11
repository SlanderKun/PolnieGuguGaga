import type { Clause, Literal, NormalForm, TruthTable } from "./types";

export function buildSDNF(table: TruthTable): NormalForm {
    const clauses: Clause[] = table.rows
        .filter((row) => table.k[row.index] === 1)
        .map((row) =>
            row.inputs.map((value, idx) => ({ varIndex: idx, negated: value === 0 })),
        );
    return { type: "SDNF", clauses };
}

export function buildSKNF(table: TruthTable): NormalForm {
    const clauses: Clause[] = table.rows
        .filter((row) => table.k[row.index] === 0)
        .map((row) =>
            row.inputs.map((value, idx) => ({ varIndex: idx, negated: value === 1 })),
        );
    return { type: "SKNF", clauses };
}

function formatLiteral(lit: Literal): string {
    const name = `x${lit.varIndex + 1}`;
    return lit.negated ? `¬${name}` : name;
}

export function formatNormalForm(nf: NormalForm): string {
    if (nf.clauses.length === 0) {
        return nf.type === "SDNF"
            ? "0 (функция тождественно ложна)"
            : "1 (функция тождественно истинна)";
    }
    const innerOp = nf.type === "SDNF" ? " ∧ " : " ∨ ";
    const outerOp = nf.type === "SDNF" ? " ∨ " : " ∧ ";
    return nf.clauses
        .map((clause) => "(" + clause.map(formatLiteral).join(innerOp) + ")")
        .join(outerOp);
}
