  import { useCurrentModal } from "@/contexts/ModalContext";
import Button from "../layout/Button";
import styles from "./RequestPopup.module.css";
import Tabs from "../layout/Tabs";
import AbsenceForm from "./AbsenceForm";
  
type Props = {
    date: Date;
    onCreate: (entry: any) => void;
}
  export default function RequestPopup({date, onCreate}: Props) {

    const {close} = useCurrentModal();
    
    const tabs = {
        "Urlaub": <AbsenceForm />,
        "Krankheit": <AbsenceForm />
    };

  return (
    <div className={styles["container"]}>
      <h2>Antrag erstellen</h2>

      <br />
    <Tabs tabs={tabs} />
      <br />

      
      <br />

      <div className={styles["container-popup-buttons"]}>
        <Button
          label="Abbrechen"
          type="primary"
          height={2.5}
          width={6}
          onClick={() => { close() }}
        />

        <Button
          label="Antrag erstellen"
          type="accent"
          height={2.5}
          width={9}
          onClick={() => {}
          }
        />
      </div>
    </div>
  );
}