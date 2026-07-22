"use client";

import Button from "@/components/layout/Button";
import Styles from "./Timecard.module.css";
import Card from "@/components/layout/Card";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import TimeEntry from "@/types/TimeEntry";
import {createTimeEntry, getLastTimeEntry, setEndTime, getTimeEntries} from "@/scripts/timeEntriesScript";
import { useRouter } from "next/navigation";
import {DateString} from "@/types/misc";
import {generateDateString} from "@/utils/TimeUtils";


interface PopupProps {
    openOverview: () => void;
    isOverviewOpenable: boolean;
    addEntry: (date: DateString, entry: TimeEntry) => void;
    updateEntry: (endTime: Date) => void;
}
//
export default function Timecard({openOverview, isOverviewOpenable = false, addEntry, updateEntry}: PopupProps) {
    const [time, setTime] = useState<Date | null>(null);
    const [clicked, setClicked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [todaysWorkTime, setTodaysWorkTime] = useState<{hours: number, minutes: number}>({hours: 0, minutes: 0});
    const router = useRouter();

    useEffect(() => {
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(()=>{
        getTodaysWorkTime();
        checkCurrentStatus();
        const interval = setInterval(()=>{
            getTodaysWorkTime();
        }, 60000);
        return() => clearInterval(interval);
    }, []);

    function checkAuth(){
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if (!token || !userid) {
            router.push("/login");
            return null;
        }
        return{token, userid: parseInt(userid)};
    }

    function mapEntry(entry: TimeEntry): TimeEntry{
        return {
            "id": entry.id,
            "userId": entry.userId,
            "startTime": entry.startTime,
            "endTime": entry.endTime,
            "type": entry.type,
        };
    }

    async function checkCurrentStatus() {
        const auth = checkAuth();
        if(!auth){
            return;
        }
        const {token, userid} = auth;

        const lastTimeEntry = (await getLastTimeEntry(token, userid, "work"))[0];

        if (lastTimeEntry == 401 || !lastTimeEntry) {
            setClicked(true);
            return;
        }

        if (!lastTimeEntry.endTime) {
            setClicked(false);
        } else {
            setClicked(true);
        }
    }

    async function setTimeEntry() {
        const buttonClickedTime = new Date();
        const auth = checkAuth();
        if(!auth){
            return;
        }
        const {token, userid} = auth;
        setLoading(true);
        const result = await createTimeEntry(token, userid, buttonClickedTime, "work");
        setLoading(false);
        if(!result || result.error === "Admins are not allowed to clock in."){
            return alert(result.error);
        }
        if(result == 401 || !result?.id){
            console.error("Fehler beim Einstempeln", result);
            return;
        }
        setClicked(false);
        addEntry(generateDateString(new Date(result.startTime)), mapEntry(result));
        getTodaysWorkTime();
    }

    async function setEndTimeEntry() {
        const auth = checkAuth();
        if(!auth){
            return;
        }
        const {token, userid} = auth;
        setLoading(true);
        const result = await getLastTimeEntry(token, userid, "work");
        if(result == 401 || !result || !Array.isArray(result)){
            console.error("Fehler beim holen des letzten Zeiteintrags", result);
            setLoading(false);
            return;
        }
        const lastTimeEntry = result[0];
        const buttonClickedTime = new Date();
        const update = await setEndTime(token, userid, parseInt(lastTimeEntry.id), buttonClickedTime);
        setLoading(false);
        if(update == 401 || !update?.id){
            console.error("Fehler beim Ausstempeln", update);
            return;
        }
        setClicked(true);
        updateEntry(buttonClickedTime);
        getTodaysWorkTime();
    }

    async function getTodaysWorkTime() {
        const auth = checkAuth();
        if (!auth){
            return;
        }
        const { token, userid } = auth;

        const todayString = new Date().toISOString().split("T")[0];
        const result = await getTimeEntries(token, userid, "work", todayString);
        if (result == 401 || !result || !Array.isArray(result)) {
            console.error("Fehler beim Holen der Zeiteinträge.");
            return;
        }

        let milisec = 0;

        for (const entry of result) {
            if (!entry.startTime){
                continue;
            }
            const start = new Date(entry.startTime);
            const end = entry.endTime ? new Date(entry.endTime) : new Date();
            milisec += end.getTime() - start.getTime();
        }

        const totalMinutes = Math.floor(milisec / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setTodaysWorkTime({ hours, minutes });
    }

    return (
        <Card width={"22vw"} styleOverrides={{flexDirection: "column", padding: "1.5rem"}}>
            <div className={Styles["clock"]}><Image src={"/clock.svg"} width={40} height={40} alt={"Uhr"}></Image></div>
            <span className={`${Styles["timeStyle"]}`}>
                        {time ? time.toLocaleTimeString("de-DE", {hour12: false}) : "--:--:--"}
                    </span>
            <span className={`${Styles["standardTextHeader"]}`}>
                        {time ? time.toLocaleDateString("de-DE", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }) : "..."}
                    </span>
            <div className={`${Styles["statusDiv"]}`}>
                <span className={`${Styles["standardTextHeader"]}`}>Status</span>
                <span className={`${Styles["standardTextBody"]}`}>{clicked ? "Nicht im Dienst" : "Im Dienst"}</span>
            </div>
            <div className={`${Styles["workTimeDiv"]}`}>
                <span className={`${Styles["workTimeTextHeader"]}`}>Heute gearbeitet</span>
                <span className={`${Styles["workTimeTextBody"]}`}> {todaysWorkTime.hours}h {todaysWorkTime.minutes}m</span>
            </div>
            <Button onClick={() => {
                if(loading){
                    return;
                }
                if(clicked){
                    setTimeEntry();
                }
                else{
                    setEndTimeEntry();
                }
            }}
            label={clicked ? "Einstempeln" : "Ausstempeln"} type={clicked ? "success" : "error"} height={2.5} width={"100%"} loading={loading}>
            </Button>
            <hr className={Styles["gap"]}></hr>
            <Button label={"Stunden-Übersicht"} type={"primary"} height={2.5} width={"100%"}
                    onClick={() => openOverview()} loading={isOverviewOpenable}></Button>
        </Card>
    );
}
