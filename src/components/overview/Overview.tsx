import * as React from 'react';
import Styles from "./Overview.module.css";
import Tabs from "@/components/layout/Tabs";
import SaldoView from "@/components/overview/SaldoView";
import DetailEntry from "@/components/overview/DetailEntry";


export default function Overview() {


    const day =
        <div className={Styles["tab-content-area"]}>
            <h1>Tag</h1>
            <SaldoView />
            <br />
            <DetailEntry />
            <DetailEntry />
            <DetailEntry />

        </div>
    const week =
    <div className={Styles["tab-content-area"]}>
        Woche
    </div>
    const month =
        <div className={Styles["tab-content-area"]}>
            Monat
        </div>

    const tabs = {
        "Tag": day,
        "Woche": week,
        "Monat": month
    }

    return (
        <>
            <h3 className={`${Styles["title"]}`}>Übersicht</h3>
            <p className={`${Styles["subtitle"]}`}>Saldo und Buchungen für Tag / Woche / Monat</p>

            <Tabs tabs={tabs} />

        </>
    );
}