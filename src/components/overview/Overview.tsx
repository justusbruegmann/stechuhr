import * as React from 'react';
import Styles from "./Overview.module.css";
import Tabs from "@/components/layout/Tabs";
import SaldoView from "@/components/overview/SaldoView";


export default function Overview() {


    const day =
        <div>
            <h1>Tag</h1>
            <SaldoView />
        </div>
    const week = <div>Woche</div>
    const month = <div>Monat</div>

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