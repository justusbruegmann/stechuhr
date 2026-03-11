"use client";

import Button from "@/components/layout/Button";
import Styles from "./Timecard.module.css";
import Card from "@/components/layout/Card";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function Timecard() {
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

    
    function returnTime() {
        setInOrOut(!inOrOut);
        const buttonClickedTime = new Date();
        const action = inOrOut ? "Eingestochen: " : "Ausgestochen: ";
        console.log(action + buttonClickedTime);
    }

    return (
        // <div className={`${Styles["background"]}`}>
            <Card width={"20vw"} height={"80vh"} styleOverrides={{flexDirection: "column"}}>
                <div className={Styles["clock"]}><Image src={"/clock.svg"} width={40} height={40} alt={"Uhr"}></Image></div>
                    <span className={`${Styles["timeStyle"]}`}>
                        {time ? time.toLocaleTimeString("de-DE", { hour12: false }) : "--:--:--"}
                    </span>
                    <span className={`${Styles["standardTextHeader"]}`}>
                        {time ? time.toLocaleDateString("de-DE",{
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
                <Button onClick={() => {setClicked(!clicked); returnTime();}} label={clicked ? "Einstempeln" : "Ausstempeln"} type={clicked? "success" : "error"} height={2.5} width={"100%"}></Button>
                <hr className={Styles["gap"]}></hr>
                <Button label={"Stunden-Übersicht"} type={"primary"} height={2.5} width={"100%"} className={Styles["gap"]}></Button>
            </Card>
        // </div>
    );
}