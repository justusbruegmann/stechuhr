'use client'

import Button from "@/components/layout/Button";
import Card from "@/components/layout/Card";
import Image from "next/image";
import styles from "./Login.module.css"
import {useState} from "react";

export default function Page() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [validInputs, setValidInputs] = useState<boolean>(true);

    const login = () : void => {
        if (username.trim() && password.trim()) {
            // Logic for BE login
            setValidInputs(true);
            console.log("logging in with" + username + " " + password);
        } else {
            setValidInputs(false);
        }
    }

    return (
        <div className={`${styles.container}`}>
            <Card height={"50vh"} width={"20vw"} shadow={true} styleOverrides={{flexDirection: 'column'}}>
                <div className={`${styles["login-center"]}`}>

                    <Image
                        src={`${process.env.BASE_PATH}/person_icon.svg`}
                        alt="person_icon"
                        width={48}
                        height={48}
                        style={{filter: 'invert()'}}
                        priority
                    />
                    Login
                </div>
                <input type="text" id="usernameInput" className={`${styles["login-input"]}`} placeholder="  Username"
                       onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" id="passwordInput" className={`${styles["login-input"]}`}
                       placeholder="  Password" onChange={(e) => setPassword(e.target.value)}/>
                {!validInputs && <p className={styles.invalidUsername}>Nutzername und Passwort sind ungültig</p>}

                <Button style={{margin: '.75rem'}} label={"Login"} type={"accent"} height={2.5}
                        width={"calc(100% - 1rem)"}
                        onClick={login}/>
            </Card>
        </div>
    );
}
