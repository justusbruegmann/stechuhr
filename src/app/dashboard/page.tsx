'use client';

import styles from "./Dashboard.module.css"

import Header from "@/components/layout/Header";
import Timecard from "@/components/timecard/Timecard";
import Calendar from "@/components/calendar/Calendar";
import {useModal} from "@/contexts/ModalContext";
import Overview from "@/components/overview/Overview";


export default function Dashboard() {

    const {showModal} = useModal();

    const openOverviewModal = () => {
        showModal("sidepane",
            <Overview/>
        )
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.viewArea}>
                    <div className={styles.headerBar}>
                        <Header/>
                    </div>

                    <Timecard openOverview={openOverviewModal}/>

                    <div className={styles.calendarWrapper}>
                        <Calendar/>
                    </div>
                </div>
            </div>
        </>
    );
}
