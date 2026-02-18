import styles from "./kalender.module.css"

export default function Kalender() {
    const heute = new Date();
    const monat = heute.getMonth();
    const jahr = heute.getFullYear();

    const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

    let ersterTag = new Date(jahr, monat, 1).getDay();
    ersterTag = (ersterTag + 6) % 7;

    const tageArray = [];
    for (let i = 0; i < ersterTag; i++) {
        tageArray.push(null);
    }
    for (let tag = 1; tag <= tageImMonat; tag++) {
        tageArray.push(tag);
    }

    return (
        <div className={styles.kalender_grid}>
            {tageArray.map((tag, index) => (
                <div key={index} className={styles.kalender_day}>
                    {tag && <div className={styles.datum}>{tag}</div>}
                </div>
            ))}
        </div>
    );
} 