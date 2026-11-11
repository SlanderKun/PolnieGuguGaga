"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import styles from "./styles.module.css";

interface Props {
    title: string;
    subtitle: string;
    value: string;
}

export default function FormulaBlock({ title, subtitle, value }: Props) {
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <div className={styles.header}>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            </div>
            <Typography className={styles.formula}>{value}</Typography>
        </Paper>
    );
}
