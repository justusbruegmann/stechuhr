// import styles from "./Calendar.module.css"
//
// export default function Calendar() {
//     const aktTag = new Date();
//     const aktMonat = aktTag.getMonth();
//     const aktJahr = aktTag.getFullYear();
//
//     const tageAktMonat = new Date(aktJahr, aktMonat + 1, 0).getDate();
//
//     let eTagMonat = new Date(aktJahr, aktMonat, 1).getDay();
//     eTagMonat = (eTagMonat + 6) % 7;
//
//     const tageArray = [];
//     for (let i = 0; i < eTagMonat; i++) {
//         tageArray.push(null);
//     }
//     for (let tag = 1; tag <= tageAktMonat; tag++) {
//         tageArray.push(tag);
//     }
//     const restTageMonat = tageArray.length % 7;
//     if (restTageMonat !== 0) {
//         for (let i = restTageMonat; i < 7; i++) {
//             tageArray.push(null);
//         }
//     }
//
//     return (
//         <div className={styles.kalender_grid}>
//             {tageArray.map((tag, index) => (
//                 <div key={index} className={styles.kalender_day}>
//                     {tag && <div className={styles.datum}>{tag}</div>}
//                 </div>
//             ))}
//         </div>
//     );
// }


"use client";
import {useState} from "react";
import Holidays from 'date-holidays';

import Card from "@/components/layout/Card";

import styles from "./Calendar.module.css"

export default function Kalender() {
    // --- Kalender ---
    const heute = new Date();
    const [aktTag, setAktTag] = useState(new Date());
    const aktMonat = aktTag.getMonth();
    const aktJahr = aktTag.getFullYear();

    const tageAktMonat = new Date(aktJahr, aktMonat + 1, 0).getDate();

    let eTagMonat = new Date(aktJahr, aktMonat, 1).getDay();
    eTagMonat = (eTagMonat + 6) % 7;

    const tageArray = [];
    for (let i = 0; i < eTagMonat; i++) {
        tageArray.push(null);
    }
    for (let tag = 1; tag <= tageAktMonat; tag++) {
        tageArray.push(tag);
    }
    const restTageMonat = tageArray.length % 7;
    if (restTageMonat !== 0) {
        for (let i = restTageMonat; i < 7; i++) {
            tageArray.push(null);
        }
    }

    // --- Wochentage ---
    const wochentage = ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa.", "So."];

    // --- Feiertage ---
    const hd = new Holidays('DE', 'BW');

    // --- Legende ---
    const symbole = [
        {
            text: "Krank",
            color: "rgb(99, 90, 0)",
            backgroundColor: "rgba(255, 234, 0, 0.5)",
            borderColor: "rgb(255, 234, 0)"
        },
        {
            text: "Urlaub",
            color: "rgb(82, 0, 120)",
            backgroundColor: "rgba(174, 0, 255, 0.5)",
            borderColor: "rgb(174, 0, 255)"
        },
        {
            text: "WE",
            color: "rgb(0, 37, 116)",
            backgroundColor: "rgba(0, 81, 255, 0.5)",
            borderColor: "rgb(0, 81, 255)"
        },
        {
            text: "FT",
            color: "rgb(124, 0, 124)",
            backgroundColor: "rgba(255, 0, 255, 0.5)",
            borderColor: "rgb(255, 0, 255)"
        },
        {
            text: ">8h",
            color: "rgb(30, 114, 30)",
            backgroundColor: "rgba(0, 255, 0, 0.5)",
            borderColor: "rgb(0, 255, 0)"
        },
        {
            text: "6-8h",
            color: "rgb(130, 72, 0)",
            backgroundColor: "rgba(255, 140, 0, 0.5)",
            borderColor: "rgb(255, 140, 0)"
        },
        {
            text: "<6h",
            color: "rgb(128, 0, 0)",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            borderColor: "rgb(255, 0, 0)"
        },
    ];

    const legende1Symbole = symbole.slice(0, 4);
    const legende2Symbole = symbole.slice(4);


    // --- Funktionen ---
    function handleMonatWechsel(richtung: "vor" | "zurueck") {
        const neuesDatum = new Date(aktTag);

        if (richtung === "vor") {
            neuesDatum.setMonth(neuesDatum.getMonth() + 1);
        } else {
            neuesDatum.setMonth(neuesDatum.getMonth() - 1);
        }

        setAktTag(neuesDatum);
    }

    function handleHeute() {
        setAktTag(new Date(heute.getFullYear(), heute.getMonth(), 1));
    }

    function handleEintraege(index: number, tag: number) {
        const eintraege = [];

        // Wochenende
        if (index % 7 === 5 || index % 7 === 6) {
            eintraege.push(
                <span
                    className={styles.kalender_symbole}
                    style={{
                        color: symbole[2].color,
                        backgroundColor: symbole[2].backgroundColor,
                        border: `2px solid ${symbole[2].borderColor}`
                    }}
                >
                    {symbole[2].text}
                </span>
            );
        }

        // Feiertag
        const feiertag = hd.isHoliday(new Date(aktJahr, aktMonat, tag));

        if (feiertag && feiertag.some(f => f.type === "public")) {
            eintraege.push(
                <span
                    className={styles.kalender_symbole}
                    style={{
                        color: symbole[3].color,
                        backgroundColor: symbole[3].backgroundColor,
                        border: `2px solid ${symbole[3].borderColor}`
                    }}
                >
                    {symbole[3].text}
                </span>
            );
        }

        // Arbeitszeit
        const arbeitszeit = -1;
        let symbolIndex: number = -1;

        switch (true) {
            case arbeitszeit >= 8:
                symbolIndex = 4;
                break;
            case arbeitszeit >= 6:
                symbolIndex = 5;
                break;
            case arbeitszeit < 6:
                symbolIndex = 6;
                break;
        }

        if (arbeitszeit !== -1) {
            eintraege.push(
                <span
                    className={styles.kalender_symbole}
                    style={{
                        color: symbole[symbolIndex].color,
                        backgroundColor: symbole[symbolIndex].backgroundColor,
                        border: `2px solid ${symbole[symbolIndex].borderColor}`
                    }}
                >
                    {arbeitszeit + "h"}
                </span>
            );
        }
        return eintraege;
    }


    // --- UI ---
    return (
        <Card>
            <div className={styles.kalender_container}>
                <div className={styles.kalender_header}>
                    <div className={styles.kalender_zeitraum}>
                        <div className={styles.kalender_zeitraum_text}>{aktJahr}</div>
                        <div
                            className={styles.kalender_zeitraum_text}>{aktTag.toLocaleDateString("de-DE", {month: "long"})}</div>
                    </div>
                    <div className={styles.kalender_navigation_grid}>
                        <button className={styles.kalender_reset_tag} onClick={() => handleHeute()}>
                            Heute
                        </button>
                        <button className={styles.kalender_pfeil} onClick={() => handleMonatWechsel("zurueck")}>
                            <img src="/Arrow_Back.svg" alt=""/>
                        </button>
                        <button className={styles.kalender_pfeil} onClick={() => handleMonatWechsel("vor")}>
                            <img src="/Arrow_Forward.svg" alt=""/>
                        </button>
                    </div>
                </div>
                <hr className={styles.linie}/>
                <br/>

                <div className={styles.kalender_wochentage_grid}>
                    {wochentage.map((wochentag, index) => (
                        <div key={index} className={styles.kalender_wochentag}>{wochentag}</div>
                    ))}
                </div>
                <div className={styles.kalender_grid}>
                    {tageArray.map((tag, index) => {
                        if (tag === null) {
                            return <div key={index} className={styles.kalender_leer}>{tag}</div>;
                        }
                        if (tag === heute.getDate() && aktMonat === heute.getMonth() && aktJahr === heute.getFullYear()) {
                            return (
                                <div key={index} className={styles.kalender_heute}>
                                    {tag && <div className={styles.kalender_tag_text}>{tag}</div>}
                                    <div className={styles.kalender_tag_symbole_container}>
                                        {handleEintraege(index, tag)}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className={styles.kalender_tag}>
                                {tag && <div className={styles.kalender_tag_text}>{tag}</div>}
                                <div className={styles.kalender_tag_symbole_container}>
                                    {handleEintraege(index, tag)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <br/>
                <hr className={styles.linie}/>

                <div className={styles.kalender_legende1}>
                    {legende1Symbole.map((symbol, index) => (
                        <span
                            key={index}
                            className={styles.kalender_symbole}
                            style={{
                                color: symbol.color,
                                backgroundColor: symbol.backgroundColor,
                                border: `2px solid ${symbol.borderColor}`
                            }}
                        >
                            {symbol.text}
                        </span>
                    ))}
                </div>

                <div className={styles.kalender_legende2}>
                    {legende2Symbole.map((symbol, index) => (
                        <span
                            key={index}
                            className={styles.kalender_symbole}
                            style={{
                                color: symbol.color,
                                backgroundColor: symbol.backgroundColor,
                                border: `2px solid ${symbol.borderColor}`
                            }}
                        >
                            {symbol.text}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
}