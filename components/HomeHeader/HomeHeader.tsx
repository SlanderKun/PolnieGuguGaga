"use client"
import React from 'react';
import styles from "./styles.module.css"
import Button from "@mui/material/Button";
import CasinoIcon from '@mui/icons-material/Casino';
import Link from "next/link";


const HomeHeader = () => {
    return (
        <div className={styles.wrapper}>
            <Button
                component={Link}
                href={"/"}
                sx={{
                height: '100px',
                width: "100px",
                color: "#FFFFFF",
                display: "flex",
                borderRadius: "20px",
                justifyContent: "space-between",
            }}>Полный гугу гага</Button>
            <Button
                component={Link}
                href={"/cases"}
                sx={{
                height: "100px",
                borderRadius: "20px",
                width: "100px",
                color: "#FFFFFF",
            }}>
                <CasinoIcon></CasinoIcon>
            </Button>
        </div>
    );
};

export default HomeHeader;