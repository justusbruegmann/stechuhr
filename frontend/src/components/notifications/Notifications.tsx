'use client';

import { useEffect, useState } from "react";
import Card from "@/components/layout/Card";
import styles from "./Notifications.module.css"
import Notification from "@/types/Notification";


type Props = {
    notifications: Notification[]
}


export default function Notifications({ notifications }: Props) {
    // Lokale Kopie, damit der isRead-Status per Dropdown umschaltbar ist,
    // ohne die Elternkomponente/Backend anzufassen.
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    const handleReadStatusChange = (id: number, value: string) => {
        setLocalNotifications((prev) =>
            prev.map((n) => n.id === id ? { ...n, isRead: value === "read" } : n)
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div>
            <h3 className={styles.title}>Benachrichtigungen</h3>
            <hr className={styles.separator} />
            {
                localNotifications.map((notification) => (
                    <Card key={notification.id}>
                        <div className={styles.notifications_container}>
                            <div className={styles.notifications_header}>
                                {notification.type === "worktime_exceeded" ? (
                                    <p className={styles.notifications_title}>Reguläre Arbeitszeit überschritten</p>
                                ) : (
                                    <p className={styles.notifications_title}>Anfrage</p>
                                )}

                                <div className={styles.notifications_status}>
                                    <span className={notification.isRead ? styles.status_read : styles.status_unread}>
                                        {notification.isRead ? "Gelesen" : "Ungelesen"}
                                    </span>
                                    <div className={styles.status_dropdown_wrapper}>
                                        <span className={styles.status_arrow}>▾</span>
                                        <select
                                            className={styles.status_select}
                                            value={notification.isRead ? "read" : "unread"}
                                            onChange={(e) => handleReadStatusChange(notification.id, e.target.value)}
                                        >
                                            <option value="unread">Ungelesen</option>
                                            <option value="read">Gelesen</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <p className={styles.notifications_text}>{notification.description}</p>
                            <p className={styles.notifications_time}>{formatDate(notification.createdAt)}</p>
                        </div>
                    </Card>
                ))
            }
        </div>
    )
}