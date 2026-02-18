import styles from "./kalender.module.css"

export default function Kalender() {
    const aktTag = new Date();
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
        <div className={styles.kalender_grid}>
            {tageArray.map((tag, index) => (
                <div key={index} className={styles.kalender_day}>
                    {tag && <div className={styles.datum}>{tag}</div>}
                </div>
            ))}
        </div>
    );
} 