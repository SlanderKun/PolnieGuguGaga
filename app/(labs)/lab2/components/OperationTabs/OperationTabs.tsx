"use client";

import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export const OPERATIONS = [
    { label: "Установить 1", description: "Выставить выбранный бит шкалы A в 1", arity: "unary" as const },
    { label: "Установить 0", description: "Выставить выбранный бит шкалы A в 0", arity: "unary" as const },
    { label: "Объединение", description: "A ∨ B — побитовое ИЛИ", arity: "binary" as const },
    { label: "Разность", description: "A \\ B — A и НЕ B", arity: "binary" as const },
    { label: "Пересечение", description: "A ∧ B — побитовое И", arity: "binary" as const },
    { label: "Симм. разность", description: "A ⊕ B — XOR", arity: "binary" as const },
];

interface Props {
    value: number;
    onChange: (value: number) => void;
}

export default function OperationTabs({ value, onChange }: Props) {
    return (
        <Tabs
            value={value}
            onChange={(_, v) => onChange(v as number)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
        >
            {OPERATIONS.map((op, i) => (
                <Tab key={i} label={op.label} />
            ))}
        </Tabs>
    );
}
