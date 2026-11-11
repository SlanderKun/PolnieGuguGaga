"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import CasinoIcon from "@mui/icons-material/Casino";
import styles from "./styles.module.css";

interface Props {
    maxN: number;
    onMaxNChange: (value: number) => void;
    onGenerate: () => void;
}

export default function Lab1Controls({ maxN, onMaxNChange, onGenerate }: Props) {
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography gutterBottom>Число переменных: {maxN}</Typography>
            <Slider
                className={styles.slider}
                value={maxN}
                onChange={(_, v) => onMaxNChange(v as number)}
                min={1}
                max={5}
                step={1}
                marks
                valueLabelDisplay="auto"
            />
            <div className={styles.actions}>
                <Button variant="contained" startIcon={<CasinoIcon />} onClick={onGenerate}>
                    Сгенерировать
                </Button>
            </div>
        </Paper>
    );
}
