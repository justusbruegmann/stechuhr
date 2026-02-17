import Button from "@/components/Button";
import Styles from "./timecard.module.css";

export default function Timecard() {
    const time = new Date();
    return (
        
        <div className={`${Styles["background"]}`}>
            <div className={`${Styles["card"]}`}>
                    <span className={`${Styles["timeStyle"]}`}>{time.toLocaleTimeString()}</span>
                    <span className={`${Styles["standardTextHeader"]}`}>{time.toDateString()}</span>
                <div className={`${Styles["statusDiv"]}`}>
                    <span className={`${Styles["standardTextHeader"]}`}>Status</span>
                    <span className={`${Styles["standardTextBody"]}`}>Nicht im Dienst</span>
                </div>
                <div className={`${Styles["workTimeDiv"]}`}>
                    <span className={`${Styles["workTimeTextHeader"]}`}>Heute gearbeitet</span>
                    <span className={`${Styles["workTimeTextBody"]}`}>0h 0m</span>
                </div>
                <Button label={"Einstempeln"} type={"success"} height={2.5} width={"100%"}></Button>
                <Button label={"Stunden-Übersicht"} type={"primary"} height={2.5} width={"100%"}></Button>
            </div>
        </div>

    );
}   