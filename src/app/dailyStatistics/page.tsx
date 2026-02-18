"use client"

import Button from "@/components/layout/Button";
import { useSidepane } from "@/contexts/SidepaneContext";

import styles from "./dailyStatistics.module.css"

export default function DailyStatistics() {
    const { showSidepane, hideSidepane } = useSidepane();
    return (
        <div className={`${styles.container}`}>
            <Button label={"18.02.2026"} type={"primary"} height={3} width={15}
                onClick={() =>
                    showSidepane(
                        <div>

                        </div>
                    )
                } />
        </div>
    );
}