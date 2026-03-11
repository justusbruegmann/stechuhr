'use client';

import styles from "./Dashboard.module.css"

import Header from "@/components/layout/Header";
import Timecard from "@/components/timecard/Timecard";
import Calendar from "@/components/calendar/Calendar";
import Card from "@/components/layout/Card";


export default function Dashboard() {

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.headerBar}>
                    <Header/>
                </div>

                <Timecard/>

                <Card className={styles.calendarWrapper}>
                    <Calendar/>
                </Card>
            </div>
        </>
    );
}
