'use client';

import { useEffect, useRef, useState } from "react";
import Card from "@/components/layout/Card";
import styles from "./Notifications.module.css"
import Notification from "@/types/Notification";


type Props = {
    notifications: Notification[]
}


export default function Notifications({ notifications }: Props) {
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    // Dropdown schließen, wenn irgendwo außerhalb geklickt wird
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleReadStatusChange = (id: number, isRead: boolean) => {
        setLocalNotifications((prev) =>
            prev.map((n) => n.id === id ? { ...n, isRead } : n)
        );
        setOpenDropdownId(null);
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
        <div ref={wrapperRef}>
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
                                        <span
                                            className={styles.status_arrow}
                                            onClick={() =>
                                                setOpenDropdownId(openDropdownId === notification.id ? null : notification.id)
                                            }
                                        >
                                            ▾
                                        </span>

                                        {openDropdownId === notification.id && (
                                            <div className={styles.status_menu}>
                                                <div
                                                    className={styles.status_menu_item}
                                                    onClick={() => handleReadStatusChange(notification.id, false)}
                                                >
                                                    Ungelesen
                                                </div>
                                                <div
                                                    className={styles.status_menu_item}
                                                    onClick={() => handleReadStatusChange(notification.id, true)}
                                                >
                                                    Gelesen
                                                </div>
                                            </div>
                                        )}
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