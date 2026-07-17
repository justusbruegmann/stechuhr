'use client';

import * as React from 'react';
import styles from "./Overview.module.css";
import Tabs from "@/components/layout/Tabs";
import SaldoView from "@/components/overview/SaldoView";
import DetailEntry from "@/components/overview/DetailEntry";
import TimeEntry from "@/types/TimeEntry";
import {getTimeEntriesByTimespan} from "@/utils/TimeUtils";
import {DateString} from "@/types/misc";
import User from "@/types/User";


interface Props {
    entries: Record<DateString, TimeEntry[]>;
    deleteEntry: (id: number) => void;
    user: User;
}


export default function Overview({entries, deleteEntry, user}: Props) {

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
            <div className={styles.tabContentArea}>
                <h1>{titles[timespan] || "Unbekannt"}</h1>
                <SaldoView timespan={timespan} timeEntries={timeEntries[timespan]} user={user}/>
                <br/>

                <div className={styles.detailEntryContainer}>
                    {timeEntries[timespan].length > 0 && timeEntries[timespan]
                        .sort((a, b) => a.startTime.localeCompare(b.startTime)) // Sort in ascending order (oldest first)
                        .map((entry) => (
                            <DetailEntry
                                key={entry.id}
                                timeEntry={entry}
                                deleteFunc={() => {
                                    deleteEntry(entry.id)
                                }}
                            />
                        ))}
                    {timeEntries[timespan].length == 0 &&
                        <div className={styles.noEntriesMessage}>
                            <p>Keine Buchungen für diesen Zeitraum vorhanden.</p>
                        </div>
                    }
                </div>
            </div>
        );
    }

    const tabs = {
        "Tag": generate_tab_content("day"),
        "Woche": generate_tab_content("week"),
        "Monat": generate_tab_content("month")
    }

    return (
        <div className={styles.overviewContainer}>
            <h3 className={styles.title}>Übersicht</h3>
            <hr className={styles.separator}/>
            <p className={styles.subtitle}>Saldo und Buchungen für Tag / Woche / Monat</p>

            <Tabs tabs={tabs}/>
        </div>
    );
}