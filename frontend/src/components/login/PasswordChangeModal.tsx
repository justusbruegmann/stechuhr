
import {useState} from 'react';
import styles from "@/app/login/Login.module.css"
import {otpChange} from "@/scripts/auth";

import Button from "@/components/layout/Button";


export function PasswordChangeModal({ password, userId, onSuccess }: any) {
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [validNewPassword, setValidNewPassword] = useState(false);

    return (
        <div>
            <h3>Password ändern</h3>
            <br/>
            <br/>
            <p className={styles["center-text"]}>Bitte ändern Sie ihr Passwort</p>
            <p className={styles["center-text"]}>Bitte nutzen Sie Groß/Kleinbuchstaben, Zahlen und Sonderzeichen</p>
            <div className={styles["password-change"]}>
                <input
                    className={`${styles["login-input"]} ${styles["login-size"]}`}
                    type="password"
                    placeholder="Passwort"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    className={`${styles["login-input"]} ${styles["login-size"]}`}
                    type="password"
                    placeholder="Passwort wiederholen"
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {validNewPassword &&
                    <p>Passwort Feld ist leer oder es hat keine 8 Zeichen mit Groß/kleinbuchstaben, Zahlen oder Sonderzeichen oder länger als 48</p>}
                <Button type={"accent"} label={"Fertig"} width={"calc(100% - 1rem)"} height={2}
                        onClick={async () => {
                            if(!(newPassword === repeatPassword)) {
                                setValidNewPassword(true);
                            }
                            let otpResult: any;
                            try {
                                otpResult = await otpChange(Number(userId), password.trim(), newPassword.trim());
                                otpResult = JSON.stringify(otpResult);
                            } catch (e) {
                                console.log(e);
                            }
                            if (typeof otpResult === "string") {
                                onSuccess();
                            } else if (otpResult === 400) {
                                setValidNewPassword(true);
                            } else {
                                console.error("f");
                            }
                        }}/>
            </div>
        </div>
    );
}
