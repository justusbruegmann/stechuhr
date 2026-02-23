'use client';

import * as React from 'react';
import Styles from "./Overview.module.css";
import Tabs from "@/components/layout/Tabs";
import SaldoView from "@/components/overview/SaldoView";
import DetailEntry from "@/components/overview/DetailEntry";
import TimeEntry from "@/types/TimeEntry";


export default function Overview() {


    // Hacky function to create test entries. ToDo: Delete
    // @ts-ignore
    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
    }

    const testTimeEntry: TimeEntry = {
        // @ts-ignore
        startTime: (new Date().addHours(-5)).toISOString(),
        endTime: new Date().toISOString(),
        userId: 'test'
    }

    const testTimeEntry2: TimeEntry = {
        // @ts-ignore
        startTime: (new Date().addHours(0.5)).toISOString(),
        // @ts-ignore
        endTime: (new Date().addHours(2)).toISOString(),
        userId: 'test'
    }

    const testTimeEntry3: TimeEntry = {
        // @ts-ignore
        startTime: (new Date().addHours(2.5)).toISOString(),
        // @ts-ignore
        endTime: (new Date().addHours(5)).toISOString(),
        userId: 'test'
    }

    const day =
        <div className={Styles["tab-content-area"]}>
            <h1>Tag</h1>
            <SaldoView />
            <br />
            <DetailEntry timeEntry={testTimeEntry} />
            <DetailEntry timeEntry={testTimeEntry2} />
            <DetailEntry timeEntry={testTimeEntry3} />
        </div>
    const week =
    <div className={Styles["tab-content-area"]}>
        Woche
    </div>
    const month =
        <div className={Styles["tab-content-area"]}>
            Monat
        </div>

    const tabs = {
        "Tag": day,
        "Woche": week,
        "Monat": month
    }

    return (
        <>
            <h3 className={`${Styles["title"]}`}>Übersicht</h3>
            <p className={`${Styles["subtitle"]}`}>Saldo und Buchungen für Tag / Woche / Monat</p>

            <Tabs tabs={tabs} />

        </>
    );
}