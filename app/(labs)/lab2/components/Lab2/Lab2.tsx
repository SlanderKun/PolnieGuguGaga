"use client";

import React, { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import {
    emptyBitArray,
    randomBitArray,
    setBit,
    toggleBit,
    union,
    difference,
    intersection,
    symmetricDifference,
    bitsToString,
    type Bit,
    type BitArray,
} from "@/lib/bitOps";

import Lab2Controls from "../Lab2Controls/Lab2Controls";
import OperationTabs, { OPERATIONS } from "../OperationTabs/OperationTabs";
import BitScale from "../BitScale/BitScale";
import styles from "./styles.module.css";

export default function Lab2() {
    const [byteCount, setByteCount] = useState(1);
    const [a, setA] = useState<BitArray>(() => emptyBitArray(1));
    const [b, setB] = useState<BitArray>(() => emptyBitArray(1));
    const [tab, setTab] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const op = OPERATIONS[tab];
    const isUnary = op.arity === "unary";

    const changeByteCount = (value: number) => {
        setByteCount(value);
        setA(emptyBitArray(value));
        setB(emptyBitArray(value));
        setSelectedIndex(null);
    };

    const generateA = () => {
        setA(randomBitArray(byteCount));
        setSelectedIndex(null);
    };

    // setState внутри useMemo запрещён — ошибку возвращаем как часть результата
    const result = useMemo(() => {
        try {
            if (isUnary) {
                if (selectedIndex === null) {
                    return { ok: true as const, bits: null, hint: "Выберите бит на шкале A — кликните по нему." };
                }
                const value: Bit = tab === 0 ? 1 : 0;
                return { ok: true as const, bits: setBit(a, selectedIndex, value), hint: null };
            }
            const fn =
                tab === 2 ? union : tab === 3 ? difference : tab === 4 ? intersection : symmetricDifference;
            return { ok: true as const, bits: fn(a, b), hint: null };
        } catch (e) {
            return { ok: false as const, message: e instanceof Error ? e.message : "Ошибка операции" };
        }
    }, [a, b, tab, selectedIndex, isUnary]);

    return (
        <div className={styles.root}>
            <Typography variant="h4" gutterBottom>
                Лаба 2 — Битовые операции
            </Typography>
            <Typography variant="body2" color="text.secondary" className={styles.intro}>
                Источник данных: случайная генерация шкалы A. Операции «Установить 1/0» применяются
                к одному выбранному биту A, остальные — к паре шкал A и B (B вводите кликами).
            </Typography>

            <Lab2Controls
                byteCount={byteCount}
                onByteCountChange={changeByteCount}
                onGenerate={generateA}
            />

            <OperationTabs value={tab} onChange={setTab} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {op.description}
            </Typography>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <Typography variant="h6">До — шкала A</Typography>
                    {isUnary && (
                        <Typography variant="caption" color="text.secondary">
                            кликните по биту, чтобы выбрать
                        </Typography>
                    )}
                </div>
                <BitScale
                    bits={a}
                    onBitClick={isUnary ? setSelectedIndex : undefined}
                    highlightIndex={isUnary ? selectedIndex : null}
                />
                <Typography className={styles.mono} sx={{ mt: 1 }}>
                    {bitsToString(a)}
                </Typography>
            </div>

            {!isUnary && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <Typography variant="h6">Шкала B</Typography>
                        <Typography variant="caption" color="text.secondary">
                            кликайте по битам, чтобы ввести
                        </Typography>
                    </div>
                    <BitScale bits={b} onBitClick={(i) => setB((prev) => toggleBit(prev, i))} />
                    <Typography className={styles.mono} sx={{ mt: 1 }}>
                        {bitsToString(b)}
                    </Typography>
                </div>
            )}

            {!result.ok && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {result.message}
                </Alert>
            )}

            {result.ok && result.hint && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {result.hint}
                </Alert>
            )}

            {result.ok && result.bits && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <Typography variant="h6">Результат</Typography>
                    </div>
                    <BitScale bits={result.bits} />
                    <Typography className={styles.mono} sx={{ mt: 1 }}>
                        {bitsToString(result.bits)}
                    </Typography>
                </div>
            )}
        </div>
    );
}
