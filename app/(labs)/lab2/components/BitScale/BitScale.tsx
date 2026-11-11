"use client";

import React from "react";
import { BITS_IN_BYTE, type BitArray } from "@/lib/bitOps";
import styles from "./styles.module.css";

interface Props {
    bits: BitArray;
    onBitClick?: (index: number) => void;
    highlightIndex?: number | null;
}

export default function BitScale({ bits, onBitClick, highlightIndex = null }: Props) {
    if (bits.length === 0) {
        return <div className={styles.empty}>Пусто</div>;
    }

    const byteCount = Math.ceil(bits.length / BITS_IN_BYTE);
    const clickable = Boolean(onBitClick);

    return (
        <div className={styles.scale}>
            {Array.from({ length: byteCount }, (_, b) => (
                <div key={b} className={styles.byteGroup}>
                    <div className={styles.byte}>
                        {Array.from({ length: BITS_IN_BYTE }, (_, j) => {
                            const index = b * BITS_IN_BYTE + j;
                            const value = bits[index];
                            const classNames = [
                                styles.bit,
                                value === 1 ? styles.on : "",
                                clickable ? styles.clickable : "",
                                highlightIndex === index ? styles.highlight : "",
                            ]
                                .filter(Boolean)
                                .join(" ");
                            return (
                                <div
                                    key={index}
                                    className={classNames}
                                    title={`бит ${index}`}
                                    onClick={clickable ? () => onBitClick!(index) : undefined}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                    <span className={styles.byteLabel}>Байт {b + 1}</span>
                </div>
            ))}
        </div>
    );
}
