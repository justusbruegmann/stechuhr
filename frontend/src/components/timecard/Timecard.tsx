"use client";

import Button from "@/components/layout/Button";
import Styles from "./Timecard.module.css";
import Card from "@/components/layout/Card";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import TimeEntry from "@/types/TimeEntry";
import {createTimeEntry, getTimeEntries, getLastTimeEntry, setEndTime} from "@/scripts/timeEntriesScript";


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

    async function checkCurrentStatus() {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if (!token || !userid) {
            console.error("Nicht eingeloggt oder kein Token");
            return;
        }

        const lastTimeEntry = (await getLastTimeEntry(token, parseInt(userid)))[0];

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
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if(!token || !userid){
            console.error("Nicht eingeloggt oder kein Token");
            return;
        }
        const result = await createTimeEntry(token, parseInt(userid), buttonClickedTime, "work");
        if(result == 401 || !result?.id){
            console.error("Fehler beim Einstempeln", result);
            return;
        }
        setStartTime(buttonClickedTime);
    }

    async function setEndTimeEntry() {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if(!token || !userid){
            console.error("Nicht eingeloggt oder kein Token");
            return;
        }
        const lastTimeEntry = (await getLastTimeEntry(token, parseInt(userid)))[0];
        console.log("DEBUG lastEntry:", JSON.stringify(lastTimeEntry));
        if(lastTimeEntry == 401 || !lastTimeEntry){
            console.error("Fehler beim holen des letzten Zeiteintrags", lastTimeEntry);
            return;
        }
        const buttonClickedTime = new Date();
        const result = await setEndTime(token, parseInt(userid), parseInt(lastTimeEntry.id), buttonClickedTime);
        if(result == 401 || !result?.id){
            console.error("Fehler beim Ausstempeln", result);
            return;
        }
    }

    async function getAllTimeEntries(){
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if(!token || !userid){
            console.error("Nicht eingeloggt oder kein Token");
            return;
        }
        const result = await getTimeEntries(token, parseInt(userid));
        console.log("DEBUG result:", JSON.stringify(result));
        if(result == 401 || !result){
            console.error("Fehler beim holen der Zeiteinträge", result);
        }
    }

    async function getLastTimeEntryFromUser(){
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if(!token || !userid){
            console.error("Nicht eingeloggt oder kein Token");
            return;
        }
        const result = await getLastTimeEntry(token, parseInt(userid));
        console.log("DEBUG result:", JSON.stringify(result));
        if(result == 401 || !result){
            console.error("Fehler beim holen der Zeiteinträge", result);
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
                //setTimeEntry();
                //getAllTimeEntries();
                //getLastTimeEntryFromUser();
            }} label={clicked ? "Einstempeln" : "Ausstempeln"} type={clicked ? "success" : "error"} height={2.5}
                    width={"100%"}></Button>
            <hr className={Styles["gap"]}></hr>
            <Button label={"Stunden-Übersicht"} type={"primary"} height={2.5} width={"100%"}
                    onClick={() => openOverview()}></Button>
        </Card>
    );
}