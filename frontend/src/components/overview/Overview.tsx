'use client';

import * as React from 'react';
import Styles from "./Overview.module.css";
import Tabs from "@/components/layout/Tabs";
import SaldoView from "@/components/overview/SaldoView";
import DetailEntry from "@/components/overview/DetailEntry";
import TimeEntry from "@/types/TimeEntry";
import {getTimeEntriesByTimespan} from "@/utils/TimeUtils";
import {DateString} from "@/types/misc";


interface Props {
    entries: Record<DateString, TimeEntry[]>;
    deleteEntry: (id: string) => void;
}


export default function Overview({entries, deleteEntry}: Props) {

    const timeEntries: Record<DateString, TimeEntry[]> = {
        "day": getTimeEntriesByTimespan(entries, "day"),
        "week": getTimeEntriesByTimespan(entries, "week"),
        "month": getTimeEntriesByTimespan(entries, "month")
    };


    function generate_tab_content(timespan: "day" | "week" | "month"): React.ReactNode {
        const titles = {
            "day": "Tag",
            "week": "Woche",
            "month": "Monat"
        }

        return (
            <div className={Styles["tab-content-area"]}>
                <h1>{titles[timespan] || "Unbekannt"}</h1>
                <SaldoView timespan={timespan} timeEntries={timeEntries[timespan]}/>
                <br/>

                {timeEntries[timespan].map((entry) => (
                    <DetailEntry
                        key={entry.id}
                        timeEntry={entry}
                        deleteFunc={() => {
                            deleteEntry(entry.id)
                        }}
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