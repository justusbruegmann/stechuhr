import Card from "@/components/layout/Card";

import styles from "./kalender.module.css"

export default function Kalender() {
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

    return (
        <Card width={"40vw"} height={"90vh"}>
            <div className={styles.kalender_container}>
                <div className={styles.kalender_header}>
                    <div className={styles.kalender_date}>{aktJahr}</div>
                    <div className={styles.kalender_date}>{aktTag.toLocaleDateString("de-DE", { month: "long" })}</div>
                </div>
                <div className={styles.kalender_grid}>
                    {tageArray.map((tag, index) => (
                        <div key={index} className={styles.kalender_day}>
                            {tag && <div className={styles.datum}>{tag}</div>}
                        </div>
                    ))}
                </div>
                <br />
                <hr className={styles.linie} />

                <div className={styles.kalender_legende}>
                    <span className={styles.kalender_symbole}>+8h</span>
                    <span className={styles.kalender_symbole}>6-8h</span>
                    <span className={styles.kalender_symbole}>&lt;6h</span>
                    <span className={styles.kalender_symbole}>Krank</span>
                    <span className={styles.kalender_symbole}>Urlaub</span>
                    <span className={styles.kalender_symbole}>WE</span>
                    <span className={styles.kalender_symbole}>FT</span>

                </div>
            </div>
        </Card>
    );
} 