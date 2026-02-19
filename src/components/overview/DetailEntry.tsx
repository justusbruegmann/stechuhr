import * as React from 'react';
import Styles from "./DetailEntry.module.css";
import Card from "@/components/layout/Card";
import Image from "next/image";


export default function DetailEntry() {

    return (
        <Card className={Styles["wrapper"]} shadow={false} border>
            <div className={Styles["col-left"]}>
                <div className={Styles["row"]}>
                    <Image src="/calendar.svg" alt="" width={15} height={15} className={Styles["calendar-icon"]}/>
                    <p className={Styles["date"]}>19.02.2026</p>
                </div>
                <div className={Styles["information"]}>
                    <div className={Styles["row"]}>Anfang: &nbsp; <div className={Styles["start-time"]}>8:45</div></div>
                    <div className={Styles["row"]}>Ende: &nbsp; <div className={Styles["end-time"]}>15:30</div></div>

                </div>
            </div>
            <div className={Styles["col-right"]}>
                <p>Dauer</p>
                <p><b>2h 35m</b></p>
            </div>
        </Card>
    );
}