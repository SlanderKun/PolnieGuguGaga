"use client"

import React from 'react';
import styles from "./styles.module.css"
import Button from "@mui/material/Button";
import Link from "next/link";

const NavList = () => {
    return (
        <div className={styles.wrapper}>
            <Button
                component={Link}
                href={"/lab1"}
                // sx={{
                //
                // }}
            >
                Лаба 1
            </Button>
            <Button
                component={Link}
                href={"/lab2"}
                // sx={{
                //
                // }}
            >
                Лаба 2
            </Button>
        </div>
    );
};

export default NavList;