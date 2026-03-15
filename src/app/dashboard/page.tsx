// 'use client';
//
// import styles from "./Dashboard.module.css"
//
// import Header from "@/components/layout/Header";
// import Timecard from "@/components/timecard/Timecard";
// import Calendar from "@/components/calendar/Calendar";
// import {useModal} from "@/contexts/ModalContext";
// import Overview from "@/components/overview/Overview";
// import {useState} from "react";
// import TimeEntry from "@/types/TimeEntry";
// import DailyDetailsPane from "@/components/timeAdjustment/DailyDetailsPane";
//
//
// export default function Dashboard() {
//
//     const {showModal} = useModal();
//     const [dailyEntries, setDailyEntries] = useState<Record<string, TimeEntry[]>>({});
//
//     const openOverviewModal = () => {
//         showModal("sidepane",
//             <Overview/>
//         )
//     }
//
//     const showDailyDetails = (datum: Date) => {
//         showModal("sidepane",
//             <DailyDetailsPane
//                 date={datum}
//                 entries={dailyEntries[datum.toDateString()] || []} // ToDo: Discuss dateString or localDateString to avoid discrepancies in different timezones
//                 // onAddEntry={(entry: TimeEntry) => setDailyEntries((prev) => [...prev, entry])}
//                 onAddEntry={(entry: TimeEntry) => setDailyEntries((prev) => ({
//                     ...prev,
//                     [datum.toDateString()]: [...(prev[datum.toDateString()] || []), entry]
//                 }))}
//             />
//         );
//     }
//
//     return (
//         <div className={styles.wrapper}>
//             <div className={styles.headerBar}>
//                 <Header/>
//             </div>
//             <div className={styles.viewArea}>
//                 <Timecard openOverview={openOverviewModal}/>
//
//                 <div className={styles.calendarWrapper}>
//                     <Calendar showDailyDetails={showDailyDetails}/>
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client';

import styles from "./Dashboard.module.css"

import Header from "@/components/layout/Header";
import Timecard from "@/components/timecard/Timecard";
import Calendar from "@/components/calendar/Calendar";
import {useModal} from "@/contexts/ModalContext";
import Overview from "@/components/overview/Overview";
import {useState} from "react";
import TimeEntry from "@/types/TimeEntry";
import DailyDetailsPane from "@/components/timeAdjustment/DailyDetailsPane";


export default function Dashboard() {

    const {showModal} = useModal();

    const [dailyEntries, setDailyEntries] = useState<Record<string, TimeEntry[]>>({});
    const addEntryForDate = (datum: Date, entry: TimeEntry) => {
        setDailyEntries((prev) => ({
            ...prev,
            [datum.toDateString()]: [...(prev[datum.toDateString()] || []), entry]
        }));
    };

    const openOverviewModal = () => {
        showModal("sidepane",
            <Overview/>
        )
    }

    const showDailyDetails = (datum: Date) => {
        showModal("sidepane",
            <DailyDetailsPane
                date={datum}
                entries={dailyEntries[datum.toDateString()] || []}
                onAddEntry={(entry: TimeEntry) => addEntryForDate(datum, entry)}
            />
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.headerBar}>
                <Header/>
            </div>
            <div className={styles.viewArea}>
                <Timecard openOverview={openOverviewModal}/>

                <div className={styles.calendarWrapper}>
                    <Calendar showDailyDetails={showDailyDetails}/>
                </div>
            </div>
        </div>
    );
}
