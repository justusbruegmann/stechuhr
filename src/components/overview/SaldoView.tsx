'use client';

import * as React from 'react';
import Styles from "./SaldoView.module.css";
import Card from "@/components/layout/Card";
import TimeEntry from "@/types/TimeEntry";
import {formatMsTime} from "@/utils/TimeUtils";

type Props = {
    timespan: "day" | "week" | "month";
    timeEntries: TimeEntry[];
}


export default function SaldoView({
                                      timespan,
                                      timeEntries
                                  }: Props) {

    const hour = 60 * 60 * 1000;
    const requiredWorkTime = timespan == "day" ? 8 * hour : timespan == "week" ? 40 * hour : 160 * hour;

    const totalWorkedTime: number = timeEntries.reduce((total, entry) => {
        const startTime = new Date(entry.startTime);
        const endTime = entry.endTime ? new Date(entry.endTime) : new Date();
        return total + (endTime.getTime() - startTime.getTime());
    }, 0);

    const saldo = totalWorkedTime - requiredWorkTime;

    return (
        <Card className={`${Styles["wrapper"]} ${saldo >= 0 ? Styles["positive-saldo"] : Styles["negative-saldo"]}`} shadow={false}>
            <p>Saldo {timespan == "day" ? "heute" : timespan == "week" ? "diese Woche" : "diesen Monat"}</p>
            <h1 className={Styles["time-display"]}>
                {saldo < 0 ? `- ${formatMsTime(-saldo)}` : `+ ${formatMsTime(saldo)}`}
            </h1>
            <div className={Styles["information"]}>
                <p>Gearbeitet: {formatMsTime(totalWorkedTime)}</p>
                <p>Soll: {formatMsTime(requiredWorkTime)}</p>
            </div>
        </Card>
    );
}