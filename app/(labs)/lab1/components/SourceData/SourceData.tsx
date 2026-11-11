"use client";

import React from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { Bit } from "@/lib/booleanAlgebra";
import styles from "./styles.module.css";

interface Props {
    n: number;
    k: Bit[];
}

export default function SourceData({ n, k }: Props) {
    return (
        <div className={styles.row}>
            <Chip color="primary" label={`N = ${n}`} />
            <Typography variant="body2" color="text.secondary">
                K =
            </Typography>
            {k.map((bit, i) => (
                <Chip
                    key={i}
                    size="small"
                    label={bit}
                    color={bit === 1 ? "success" : "default"}
                    variant={bit === 1 ? "filled" : "outlined"}
                />
            ))}
        </div>
    );
}
