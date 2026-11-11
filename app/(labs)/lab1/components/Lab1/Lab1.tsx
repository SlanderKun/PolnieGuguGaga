"use client";

import React, { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import {
    randomData,
    buildTruthTable,
    buildSDNF,
    buildSKNF,
    formatNormalForm,
    type Bit,
} from "@/lib/booleanAlgebra";

import Lab1Controls from "../Lab1Controls/Lab1Controls";
import SourceData from "../SourceData/SourceData";
import TruthTableView from "../TruthTableView/TruthTableView";
import FormulaBlock from "../FormulaBlock/FormulaBlock";
import styles from "./styles.module.css";

export default function Lab1() {
    const [n, setN] = useState(4);
    const [data, setData] = useState<{ n: number; k: Bit[] } | null>(null);
    const [genError, setGenError] = useState<string | null>(null);

    const generate = () => {
        try {
            setData(randomData(n));
            setGenError(null);
        } catch (e) {
            setGenError(e instanceof Error ? e.message : "Неизвестная ошибка генерации");
            setData(null);
        }
    };

    // setState внутри useMemo запрещён — ошибку возвращаем как часть результата
    const result = useMemo(() => {
        if (!data) return null;
        try {
            const table = buildTruthTable(data.n, data.k);
            return {
                ok: true as const,
                table,
                sdnf: formatNormalForm(buildSDNF(table)),
                sknf: formatNormalForm(buildSKNF(table)),
            };
        } catch (e) {
            return {
                ok: false as const,
                message: e instanceof Error ? e.message : "Ошибка построения таблицы",
            };
        }
    }, [data]);

    const shownError = genError ?? (result && !result.ok ? result.message : null);

    return (
        <div className={styles.root}>
            <Typography variant="h4" gutterBottom>
                Лаба 1 — СДНФ / СКНФ
            </Typography>
            <Typography variant="body2" color="text.secondary" className={styles.intro}>
                Очередной казик.
            </Typography>

            <Lab1Controls maxN={n} onMaxNChange={setN} onGenerate={generate} />

            {shownError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {shownError}
                </Alert>
            )}

            {data && result?.ok && (
                <>
                    <SourceData n={data.n} k={data.k} />
                    <TruthTableView table={result.table} />
                    <FormulaBlock title="СДНФ" subtitle="по строкам, где f = 1" value={result.sdnf} />
                    <FormulaBlock title="СКНФ" subtitle="по строкам, где f = 0" value={result.sknf} />
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Обозначения: <b>∧</b> — И (конъюнкция), <b>∨</b> — ИЛИ (дизъюнкция),{" "}
                        <b>¬</b> — отрицание переменной.
                    </Alert>
                </>
            )}
        </div>
    );
}
