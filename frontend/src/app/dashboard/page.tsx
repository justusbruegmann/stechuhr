'use client';
import styles from "./Dashboard.module.css"
//needed to merge
import Header from "@/components/layout/Header";
import Timecard from "@/components/timecard/Timecard";
import Calendar from "@/components/calendar/Calendar";
import {useModal} from "@/contexts/ModalContext";
import Overview from "@/components/overview/Overview";
import {useCallback, useEffect, useRef, useState} from "react";
import TimeEntry from "@/types/TimeEntry";
import DailyDetailsPane from "@/components/timeAdjustment/DailyDetailsPane";
import {useRouter} from "next/navigation";

import {loginToken} from "@/scripts/auth";
import {getTimeEntries} from "@/scripts/timeEntriesScript";
import {DateString} from "@/types/misc";
import {generateDateString, startOfTheMonthDateString, todayDateString} from "@/utils/TimeUtils";
import User from "@/types/User";
import {getUserById} from "@/scripts/userManagement";


export default function Dashboard() {

    const {showModal, updateModalContent} = useModal();
    const router = useRouter();

    /**
     * The dailyEntries state is used as a central state to store a relevant section of all logged time entries for the frontend.
     * It is structured as a map where the key is the DateString (TimeUtils.generateDateString())
     * and the value is an array of TimeEntry objects.
     */
    const [dailyEntries, setDailyEntries] = useState<Record<DateString, TimeEntry[]>>({});
    const [currentUser, setCurrentUser] = useState<User>();

    const currentlyOpenModal = useRef<
        { id: string; type: "OverviewModal" } |
        { id: string; type: "DailyDetails"; date: DateString } |
        null
    >(null);

    const addEntryForDate = (date: DateString, entry: TimeEntry) => {
        setDailyEntries((prev) => ({
            ...prev,
            [date]: [...(prev[date] || []), entry]
        }));
    };

    async function authCheck() {
        const token = localStorage.getItem("token")
        const userid = localStorage.getItem("userid")

        if (!token || !userid) {
            router.push("/login")
            return
        }

        const login = await loginToken(token, userid);

        if (!login || login === 401 || login === 485 || login === 400) {
            router.push("/login")
            return;
        }

        localStorage.setItem("role", login.role);
    }

    useEffect(() => {
        authCheck().then(async (r) => {
            const token = localStorage.getItem("token")
            const userid = localStorage.getItem("userid")

            if (!token || !userid) {
                router.push("/login")
                return
            }

            const timeEntries: TimeEntry[] = await getTimeEntries(
                token,
                Number(userid),
                "work",
                startOfTheMonthDateString(),
                todayDateString()
            );

            const grouped = timeEntries.reduce<Record<DateString, TimeEntry[]>>(
                (collection, timeEntry) => {
                    const key = generateDateString(new Date(timeEntry.startTime));
                    if (!collection[key]) collection[key] = [];
                    collection[key].push(timeEntry);
                    return collection;
                },
                {},
            );
            setDailyEntries(grouped);

            // Load user
            // Since this is currently only needed for the <Overview>, we preload it but need not await for the site to
            // be usable
            loadCurrentUser();
        });
    }, [router])


    async function loadCurrentUser() {
        try {
            const user: User = await getUserById(Number(localStorage.getItem("userid")))
            setCurrentUser(user);
        } catch (e) {
            console.error(e);
        }
    }


    const deleteEntry = (id: string) => {
        console.log(id);

        setDailyEntries((prev) =>
            Object.fromEntries(
                Object.entries(prev).map(([dateString, entries]) => [
                    dateString,
                    entries.filter((entry) => entry.id !== id)
                ])
            )
        );
    }

    function createOverviewContent() {
        if (!currentUser) {
            console.log("Failed to load user");
            return;
        }

        return <Overview entries={dailyEntries} deleteEntry={deleteEntry} user={currentUser}/>
    }

    const createDailyDetailsContent = (date: DateString) => (
        <DailyDetailsPane
            date={date}
            entries={dailyEntries[date] || []}
            onAddEntry={(entry: TimeEntry) => addEntryForDate(date, entry)}
            deleteEntry={deleteEntry}
        />
    );

    // Update modal content when dailyEntries change
    useEffect(() => {
        if (currentlyOpenModal.current) {
            if (currentlyOpenModal.current.type === "DailyDetails") {
                console.log("Trying to update daily details")
                updateModalContent(
                    currentlyOpenModal.current.id,
                    createDailyDetailsContent(currentlyOpenModal.current.date)
                );
            } else if (currentlyOpenModal.current.type === "OverviewModal") {
                if (currentUser) {
                    updateModalContent(
                        currentlyOpenModal.current.id,
                        createOverviewContent()
                    );
                }
            }
        }
    }, [dailyEntries, updateModalContent]);

    const openOverviewModal = useCallback(() => {
        const {id} = showModal("sidepane", createOverviewContent())
        currentlyOpenModal.current = {id, type: "OverviewModal"};
    }, [dailyEntries, showModal, addEntryForDate]);

    const showDailyDetails = useCallback((datum: DateString) => {
        console.log("show daily details for " + datum);
        const {id} = showModal("sidepane", createDailyDetailsContent(datum));
        currentlyOpenModal.current = {id, type: "DailyDetails", date: datum};
    }, [dailyEntries, showModal, addEntryForDate]);


    return (
        <div className={styles.wrapper}>
            <div className={styles.headerBar}>
                <Header name={"dashboard"}/>
            </div>
            <div className={styles.viewArea}>
                <Timecard openOverview={openOverviewModal} isOverviewOpenable={!currentUser} addEntry={addEntryForDate} />

                <div className={styles.calendarWrapper}>
                    <Calendar showDailyDetails={showDailyDetails} timeEntries={dailyEntries}/>
                </div>
            </div>
        </div>
    );
}
