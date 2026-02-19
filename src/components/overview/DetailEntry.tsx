import * as React from 'react';
import Styles from "./DetailEntry.module.css";
import Card from "@/components/layout/Card";
import Image from "next/image";


export default function DetailEntry() {

    return (
        <Card className={Styles["wrapper"]} shadow={false} border>
            <div className={Styles["row"]}>
                <Image src="/calendar.svg" alt="" width={10} height={10} className={Styles["calendar-icon"]}/>
                <p className={Styles["date"]}>19.02.2026</p>
            </div>
            <div className={Styles["information"]}>
                <p className={Styles["row"]}>Anfang: &nbsp; <text className={Styles["start-time"]}>8:45</text></p>
                <p className={Styles["row"]}>Ende: &nbsp; <text className={Styles["end-time"]}>15:30</text></p>

            </div>
        </Card>
    );
}