'use client';

import * as React from 'react';
import Styles from "./DetailEntry.module.css";
import Card from "@/components/layout/Card";
import Image from "next/image";
import TimeEntry from "@/types/TimeEntry";
import {formatDate, formatDuration, formatTime} from "@/utils/DateUtils";


type Props = {
    timeEntry: TimeEntry;
}


export default function DetailEntry({timeEntry}: Props) {

    const startTime = new Date(timeEntry.startTime)
    const endTime: Date | null = timeEntry.endTime ? new Date(timeEntry.endTime) : null





    return (
        <Card className={Styles["wrapper"]} shadow={false}>
            <div className={Styles["main-content"]}>
                <div className={Styles["col-left"]}>
                    <div className={Styles["row"]}>
                        <Image src="/calendar.svg" alt="" width={15} height={15} className={Styles["calendar-icon"]}/>
                        <p className={Styles["date"]}>
                            {formatDate(startTime)}
                        </p>
                    </div>
                    <div className={Styles["information"]}>
                        <div className={Styles["row"]}>Anfang: &nbsp;
                            <div className={Styles["start-time"]}>
                                {formatTime(startTime)}
                            </div>
                        </div>

                        {endTime &&
                            <div className={Styles["row"]}>Ende: &nbsp;
                                <div className={Styles["end-time"]}>
                                    {formatTime(endTime)}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className={Styles["col-right"]}>
                    <p>Dauer</p>
                    <p><b>
                        {formatDuration(startTime, endTime ? endTime : new Date())}
                        {
                            // ToDo: Dynamically update current time if endTime is null, so that the displayed time updates
                        }
                    </b></p>
                </div>
            </div>

            <div className={Styles["edit-button"]} onClick={() => alert("Edit")}>
                <Image src="/edit.svg" alt="" width={30} height={30} className={Styles["edit-button-icon"]}/>
            </div>
        </Card>
    );
}