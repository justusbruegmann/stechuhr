'use client';

import { useEffect, useRef, useState } from "react";
import Card from "@/components/layout/Card";
import styles from "./Notifications.module.css"
import Notification from "@/types/Notification";
import { deleteNotification, patchNotification } from "@/scripts/notifications";


type Props = {
    notifications: Notification[]
    updateNotification: (id: number, isRead: boolean) => void
    killNotification: (id: number) => void
}

export default function Notifications({ notifications, updateNotification, killNotification }: Props) {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
    const [loadingReadId, setLoadingReadId] = useState<number | null>(null);
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

        setLoadingReadId(id);

        try {
            const result = await patchNotification(id, isRead);
            if (!result || result == 400 || result == 401) {
                console.error("Notification update fehlgeschlagen", result);
                return;
            }

            updateNotification(id, isRead);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingReadId(null);
        }
    };
    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userid");
        if (!token || !userId) {
            return;
        }

        setLoadingDeleteId(id);

        try {
            const result = await deleteNotification(id);

            if (!result || result == 400 || result == 401) {
                console.error("Notification delete fehlgeschlagen", result);
                return;
            }

            killNotification(id);
        } finally {
            setLoadingDeleteId(null);
        }
    }

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
                notifications.map((notification) => {
                    const isLoading =
                        loadingDeleteId === notification.id ||
                        loadingReadId === notification.id;

                    return (<Card key={notification.id}>
                        <div
                            className={`
                                ${styles.notifications_container} 
                                ${isLoading ? styles.loading : ""}
                                `}
                        >
                            <div className={styles.notifications_header}>
                                {notification.type === "worktime_exceeded" ? (
                                    <p className={styles.title}>Zeitregelung missachtet</p>
                                ) : (
                                    <p className={styles.title}>Anfrage bearbeitet</p>
                                )}

                                <div className={styles.status}>
                                    {loadingReadId === notification.id ? (
                                        <span className={styles.spinnerIsRead}></span>
                                    ) : (
                                        <span className={notification.isRead ? styles.read : styles.unread}>
                                            {notification.isRead ? "Gelesen" : "Ungelesen"}
                                        </span>
                                    )}


                                    <div className={styles.dropdown_wrapper}>
                                        <span
                                            className={styles.arrow}
                                            onClick={() => {
                                                if (isLoading) return;

                                                setOpenDropdownId(
                                                    openDropdownId === notification.id ? null : notification.id
                                                );
                                            }}
                                        >
                                            ▾
                                        </span>

                                        {openDropdownId === notification.id && (
                                            <div className={styles.menu}>
                                                <div
                                                    className={styles.menu_item}
                                                    onClick={() => {
                                                        if (!isLoading) {
                                                            handleReadStatusChange(notification.id, false);
                                                        }
                                                    }}
                                                >
                                                    Ungelesen
                                                </div>
                                                <div
                                                    className={styles.menu_item}
                                                    onClick={() => {
                                                        if (!isLoading) {
                                                            handleReadStatusChange(notification.id, true);
                                                        }
                                                    }}
                                                >
                                                    Gelesen
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className={styles.notifications_text}>{notification.description}</p>

                            <div className={styles.notifications_footer}>
                                <p className={styles.time}>{formatDate(notification.createdAt)}</p>
                                <button
                                    className={styles.delete_button}
                                    disabled={isLoading}
                                    onClick={() => handleDelete(notification.id)}
                                >
                                    {loadingDeleteId === notification.id ? (
                                        <span className={styles.spinnerDelete}></span>
                                    ) : (
                                        "Löschen"
                                    )}
                                </button>
                            </div>
                        </div>
                    </Card>
                    );
                })
            }
        </div>
    )
}