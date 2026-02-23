'use client';

import * as React from 'react';
import Styles from "./SaldoView.module.css";
import Card from "@/components/layout/Card";


export default function SaldoView() {

    return (
        <Card className={Styles["wrapper"]} shadow={false}>
            <p>Saldo heute</p>
            <h1 className={Styles["time-display"]}>-8h 0m</h1>
            <div className={Styles["information"]}>
                <p>Gearbeitet: +0h 0m</p>
                <p>Soll: 8h</p>
            </div>
        </Card>
    );
}