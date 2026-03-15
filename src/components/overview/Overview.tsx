'use client';

import * as React from 'react';
import Styles from "./Overview.module.css";
import Tabs from "@/components/layout/Tabs";
import SaldoView from "@/components/overview/SaldoView";
import DetailEntry from "@/components/overview/DetailEntry";
import TimeEntry from "@/types/TimeEntry";
import {getTimeEntriesByTimespan} from "@/utils/TimeUtils";


interface Props {
    entries: Record<string, TimeEntry[]>;
}

export default function Overview({ entries }: Props) {


    // // Hacky function to create test entries. ToDo: Delete
    // // @ts-ignore
    // Date.prototype.addHours = function (h) {
    //     this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    //     return this;
    // }
    //
    // const testTimeEntries = [
    //     {
    //         id: "1",
    //         // @ts-ignore
    //         startTime: (new Date().addHours(-5)).toISOString(),
    //         endTime: new Date().toISOString(),
    //         userId: 'test'
    //     },
    //     {
    //         id: "2",
    //         // @ts-ignore
    //         startTime: (new Date().addHours(0.33)).toISOString(),
    //         // @ts-ignore
    //         endTime: (new Date().addHours(2)).toISOString(),
    //         userId: 'test'
    //     },
    //     {
    //         id: "3",
    //         // @ts-ignore
    //         startTime: (new Date().addHours(2.4)).toISOString(),
    //         // @ts-ignore
    //         endTime: (new Date().addHours(5)).toISOString(),
    //         userId: 'test'
    //     }
    // ]


    const timeEntries: Record<string, TimeEntry[]> = {
        "day": getTimeEntriesByTimespan(entries, "day"),
        "week": getTimeEntriesByTimespan(entries, "week"),
        "month": getTimeEntriesByTimespan(entries, "month")
    };


    function generate_tab_content(timespan: "day" | "week" | "month"): React.ReactNode {
        let title: string;

        switch (timespan) {
            case "day": {
                title = "Tag";
                break;
            }
            case "week": {
                title = "Woche";
                break;
            }
            case "month": {
                title = "Monat";
                break;
            }
            default: {
                title = "Unbekannt";
                break;
            }
        }


        return (
            <div className={Styles["tab-content-area"]}>
                <h1>{title}</h1>
                <SaldoView timespan={timespan} timeEntries={timeEntries[timespan]}/>
                <br/>

                {timeEntries[timespan].map((entry) => (
                    <DetailEntry
                        key={entry.id}
                        timeEntry={entry}
                    />
                ))}
            </div>
        );
    }

    const tabs = {
        "Tag": generate_tab_content("day"),
        "Woche": generate_tab_content("week"),
        "Monat": generate_tab_content("month")
    }

    return (
        <>
            <h3 className={`${Styles["title"]}`}>Übersicht</h3>
            <hr className={`${Styles["separator"]}`}/>
            <p className={`${Styles["subtitle"]}`}>Saldo und Buchungen für Tag / Woche / Monat</p>

            <Tabs tabs={tabs}/>
        </>
    );
}