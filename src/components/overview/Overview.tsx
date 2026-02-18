import * as React from 'react';
import Card from "@/components/layout/Card";
import Styles from "./Overview.module.css";


export default function Overview() {

    return (
        <>
            <h3 className={`${Styles["title"]}`}>Übersicht</h3>
            <p className={`${Styles["subtitle"]}`}>Saldo und Buchungen für Tag / Woche / Monat</p>

            <Card>
                <div>
                    Test
                </div>
            </Card>

        </>
    );
}