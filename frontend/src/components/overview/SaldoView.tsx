'use client';

import * as React from 'react';
import Styles from "./SaldoView.module.css";
import Card from "@/components/layout/Card";
import TimeEntry from "@/types/TimeEntry";
import {formatMsTime, getWorkdaysInCurrentMonth} from "@/utils/TimeUtils";
import User from "@/types/User";

type SaldoViewProps = {
    timespan: "day" | "week" | "month";
    timeEntries: TimeEntry[];
    user: User;
}


export default function SaldoView({
                                      timespan,
                                      timeEntries,
                                      user,
                                  }: SaldoViewProps) {

    const hour = 60 * 60 * 1000;
    const workloadPerDay = user.workload * hour / 5
    const workdaysInCurrentMonth = getWorkdaysInCurrentMonth();
    const requiredWorkTime = timespan == "day" ? workloadPerDay : timespan == "week" ? workloadPerDay * 5 : workloadPerDay * workdaysInCurrentMonth;

    const totalWorkedTime: number = timeEntries.reduce((total, entry) => {
        const startTime = new Date(entry.startTime);
        const endTime = entry.endTime ? new Date(entry.endTime) : new Date();
        return total + (endTime.getTime() - startTime.getTime());
    }, 0);

    const saldo = totalWorkedTime - requiredWorkTime;

    return (
        <Card className={`${Styles["wrapper"]} ${saldo >= 0 ? Styles["positive-saldo"] : Styles["negative-saldo"]}`}
              shadow={false}>
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