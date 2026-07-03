'use client';

import Card from "@/components/layout/Card";
import styles from "./Notifications.module.css"
import { useState } from "react";
import TimeEntry from "@/types/TimeEntry";

type Props = {
    showDailyDetails: (date: Date) => void;
    timeEntries: Record<string, TimeEntry[]>
}

export default function Notifications({ showDailyDetails, timeEntries }: Props) {
    return (
        <Card>
            <div className={styles.notifications_container}>
                <p className={styles.notifications_title}>TITEL</p>
                <p className={styles.notifications_text}>TEXT TEXT TEXT</p>
            </div>
        </Card>
    )
}