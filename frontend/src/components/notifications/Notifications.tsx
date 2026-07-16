'use client';

import Card from "@/components/layout/Card";
import styles from "./Notifications.module.css"
import Notification from "@/types/Notification";


type Props = {
    notifications: Notification[]
}


export default function Notifications({ notifications }: Props) {
    return (
        <div>
            <h3 className={styles.title}>Benachrichtigungen</h3>
            <hr className={styles.separator} />
            {
                notifications.map((notifications, index) =>
                (
                    <Card key={index}>
                        <div className={styles.notifications_container}>
                            <div>
                                <p className={styles.notifications_title}>{notifications.type}</p>
                                <p className={styles.notifications_text}>{notifications.description}</p>
                            </div>
                        </div>
                    </Card>
                ))
            }
        </div>
    )
}