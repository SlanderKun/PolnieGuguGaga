"use client";

import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { TruthTable } from "@/lib/booleanAlgebra";

interface Props {
    table: TruthTable;
}

export default function TruthTableView({ table }: Props) {
    return (
        <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {Array.from({ length: table.n }, (_, i) => (
                            <TableCell key={i} align="center">
                                x{i + 1}
                            </TableCell>
                        ))}
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                borderLeft: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            f
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {table.rows.map((row) => {
                        const f = table.k[row.index];
                        return (
                            <TableRow key={row.index} hover>
                                {row.inputs.map((v, i) => (
                                    <TableCell key={i} align="center">
                                        {v}
                                    </TableCell>
                                ))}
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: 700,
                                        borderLeft: "1px solid",
                                        borderColor: "divider",
                                        color: f === 1 ? "success.main" : "text.secondary",
                                    }}
                                >
                                    {f}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
