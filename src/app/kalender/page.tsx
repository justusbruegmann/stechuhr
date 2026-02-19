import Card from "@/components/layout/Card";

import styles from "./kalender.module.css"

export default function Kalender() {
    // --- Kalender --- 
    const heute = new Date();
    const aktTag = new Date(2021, 7, 1);
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

    // --- Legende ---
    const symbole = [
        {
            text: "Krank",
            color: "rgb(0, 37, 116)",
            backgroundColor: "rgba(0, 81, 255, 0.5)",
            borderColor: "rgb(0, 81, 255)"
        },
        {
            text: "Urlaub",
            color: "rgb(82, 0, 120)",
            backgroundColor: "rgba(174, 0, 255, 0.5)",
            borderColor: "rgb(174, 0, 255)"
        },
        {
            text: "WE",
            color: "rgb(126, 115, 0)",
            backgroundColor: "rgba(255, 234, 0, 0.5)",
            borderColor: "rgb(255, 234, 0)"
        },
        {
            text: "FT",
            color: "rgb(124, 0, 124)",
            backgroundColor: "rgba(255, 0, 255, 0.5)",
            borderColor: "rgb(255, 0, 255)"
        },
        {
            text: "+8h",
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


    // --- UI ---
    return (
        <Card width={"40vw"} height={"90vh"}>
            <div className={styles.kalender_container}>
                <div className={styles.kalender_zeitraum}>
                    <div className={styles.kalender_zeitraum_text}>{aktJahr}</div>
                    <div className={styles.kalender_zeitraum_text}>{aktTag.toLocaleDateString("de-DE", { month: "long" })}</div>
                </div>
                <hr className={styles.linie} />
                <br />

                <div className={styles.kalender_wochentage_grid}>
                    {wochentage.map((wochentag, index) => (
                        <div key={index} className={styles.kalender_wochentag}>{wochentag}</div>
                    ))}
                </div>
                <div className={styles.kalender_grid}>
                    {tageArray.map((tag, index) => {
                        if (tag === heute.getDate() && aktMonat === heute.getMonth() && aktJahr === heute.getFullYear()) {
                            return (<div key={index} className={styles.kalender_heute}>
                                {tag && <div className={styles.kalender_tag_text}>{tag}</div>}
                            </div>);
                        }
                        if (tag === null) {
                            return <div key={index} className={styles.kalender_leer}>{tag}</div>;
                        }
                        return (
                            <div key={index} className={styles.kalender_tag}>
                                {tag && <div className={styles.kalender_tag_text}>{tag}</div>}
                            </div>
                        );
                    })}
                </div>

                <br />
                <hr className={styles.linie} />

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