"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import CasinoIcon from "@mui/icons-material/Casino";
import styles from "./styles.module.css";

interface Props {
    byteCount: number;
    onByteCountChange: (value: number) => void;
    onGenerate: () => void;
}

export default function Lab2Controls({ byteCount, onByteCountChange, onGenerate }: Props) {
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography gutterBottom>Количество байт: {byteCount} ({byteCount * 8} бит)</Typography>
            <Slider
                className={styles.slider}
                value={byteCount}
                onChange={(_, v) => onByteCountChange(v as number)}
                min={1}
                max={4}
                step={1}
                marks
                valueLabelDisplay="auto"
            />
            <div className={styles.actions}>
                <Button variant="contained" startIcon={<CasinoIcon />} onClick={onGenerate}>
                    Случайная шкала A
                </Button>
            </div>
        </Paper>
    );
}
