'use client';

import { useEffect, useRef, useState } from "react";
import Card from "@/components/layout/Card";
import styles from "./Notifications.module.css"
import Notification from "@/types/Notification";
import { patchNotification } from "@/scripts/notifications";


type Props = {
    notifications: Notification[]
    updateNotification: (id:number, isRead: boolean) => void
}


export default function Notifications({ notifications, updateNotification  }: Props) {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleReadStatusChange = async (id: number, isRead: boolean) => {
        setOpenDropdownId(null);

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userid");
        if (!token || !userId) {
            return;
        }

        const result = await patchNotification(token, Number(userId), id, isRead);
        if (!result || result == 400 || result == 401) {
            console.error("Notification update fehlgeschlagen", result);
            return;
        }

        updateNotification(id, isRead);
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
                notifications.map((notification) => (
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