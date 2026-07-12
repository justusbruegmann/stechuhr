"use client";

import Button from "@/components/layout/Button";
import Styles from "./Timecard.module.css";
import Card from "@/components/layout/Card";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import TimeEntry from "@/types/TimeEntry";
import {createTimeEntry, getTimeEntries, getLastTimeEntry, setEndTime} from "@/scripts/timeEntriesScript";
import { useRouter } from "next/navigation";


interface PopupProps {
    openOverview: () => void;
    addEntry: (date: Date, entry: TimeEntry) => void;
}


export default function Timecard({openOverview, addEntry}: PopupProps) {
    const [time, setTime] = useState<Date | null>(null);
    const [clicked, setClicked] = useState(true);
    const working = "Im Dienst";
    const notWorking = "Nicht im Dienst";
    const [inOrOut, setInOrOut] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        checkCurrentStatus();
    }, []);

    const [startTime, setStartTime] = useState<Date | null>(null);

    function checkAuth(router: ReturnType<typeof useRouter>){
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if (!token || !userid) {
            router.push("/login");
            return null;
        }
        return{token, userid: parseInt(userid)};
    }

    async function checkCurrentStatus() {
        const auth = checkAuth(router);
        if(!auth){
            return;
        }
        const {token, userid} = auth;

        const lastTimeEntry = (await getLastTimeEntry(token, userid))[0];

        if (lastTimeEntry == 401 || !lastTimeEntry) {
            setClicked(true);
            setInOrOut(true);
            return;
        }

        if (!lastTimeEntry.endTime) {
            setClicked(false);
            setInOrOut(false);
            setStartTime(new Date(lastTimeEntry.startTime));
        } else {
            setClicked(true);
            setInOrOut(true);
        }
    }

    async function setTimeEntry() {
        const buttonClickedTime = new Date();
        const auth = checkAuth(router);
        if(!auth){
            return;
        }
        const {token, userid} = auth;
        const result = await createTimeEntry(token, userid, buttonClickedTime, "work");
        if(result == 401 || !result?.id){
            console.error("Fehler beim Einstempeln", result);
            return;
        }
        setStartTime(buttonClickedTime);
    }

    async function setEndTimeEntry() {
        const auth = checkAuth(router);
        if(!auth){
            return;
        }
        const {token, userid} = auth;
        const result = await getLastTimeEntry(token, userid);
        if(result == 401 || !result || !Array.isArray(result)){
            console.error("Fehler beim holen des letzten Zeiteintrags", result);
            return;
        }
        const lastTimeEntry = result[0];
        const buttonClickedTime = new Date();
        const update = await setEndTime(token, userid, parseInt(lastTimeEntry.id), buttonClickedTime);
        if(update == 401 || !update?.id){
            console.error("Fehler beim Ausstempeln", result);
            return;
        }
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
                <span className={`${Styles["standardTextBody"]}`}>{clicked ? notWorking : working}</span>
            </div>
            <div className={`${Styles["workTimeDiv"]}`}>
                <span className={`${Styles["workTimeTextHeader"]}`}>Heute gearbeitet</span>
                <span className={`${Styles["workTimeTextBody"]}`}>0h 0m</span>
            </div>
            <Button onClick={() => {
                setInOrOut(!inOrOut);
                const action = inOrOut ? "Eingestochen: " : "Ausgestochen: ";
                console.log(action + new Date());
                setClicked(!clicked);
                if(clicked){
                    console.log("ein"+clicked);
                    setTimeEntry();
                }
                else{
                    console.log("aus"+clicked);
                    setEndTimeEntry();
                }
            }} label={clicked ? "Einstempeln" : "Ausstempeln"} type={clicked ? "success" : "error"} height={2.5}
                    width={"100%"}></Button>
            <hr className={Styles["gap"]}></hr>
            <Button label={"Stunden-Übersicht"} type={"primary"} height={2.5} width={"100%"}
                    onClick={
                        () => openOverview()
                    }></Button>
        </Card>
    );
}