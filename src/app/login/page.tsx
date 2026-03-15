'use client';

import Button from "@/components/layout/Button";
import Card from "@/components/layout/Card";
import {useModal} from "@/contexts/ModalContext"
import Image from "next/image";
import styles from "./Login.module.css"
import {useState, useEffect} from "react";

export default function Page() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [validInputs, setValidInputs] = useState<boolean>(true);
    const [width, setWidth] = useState("20vw");
    const {showModal} = useModal();


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 400) {
                setWidth("100vw");
            } else if (window.innerWidth < 900) {
                setWidth("40vw");
            } else if
            (window.innerWidth < 1200) {
                setWidth("30vw");
            } else {
                setWidth("20vw");
            }
        };

        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const login = (): void => {
        if (username.trim() && password.trim()) {
            // Logic for BE login
            setValidInputs(true);
            if (username.trim() === "123" && password.trim() === "123") {
               const {close} = showModal("popup",
                    <div>
                        <h3>Password ändern</h3>
                        <br/>
                        <br/>
                        <p className={styles["center-text"]}>Bitte ändern Sie ihr Passwort</p>
                        <p className={styles["center-text"]}>Bitte nutzen Sie Groß/Kleinbuchstaben, Zahlen und
                            Sonderzeichen</p>
                        <div className={styles["password-change"]}>
                            <input type="password" className={`${styles["login-input"]} ${styles["login-size"]}`}
                                   placeholder="Passwort"/>
                            <input type="password" className={`${styles["login-input"]} ${styles["login-size"]}`}
                                   placeholder="Passwort wiederholen"/>
                            <Button type={"accent"} label={"Fertig"} width={"calc(100% - 1rem)"} height={2}
                                    onClick={() => {
                                        //TODO: if Backend exist make a function
                                        alert("change password");
                                        close()
                                    }}/>
                                        </div>
                                        </div>
                                        )
                                    }
            console.log("logging in with" + username + " " + password);
        } else {
            setValidInputs(false);
        }
    }

    return (
        <div className={`${styles.container}`}>
            <Card height={"50vh"} width={width} shadow={true} styleOverrides={{flexDirection: 'column'}}>
                <div className={`${styles["login-center"]}`}>
                    <Image
                        src={`/person_icon.svg`}
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
                <div className={`${styles["login-center"]}`}>
                    {!validInputs && <p className={styles.invalidUsername}>Nutzername und Passwort sind ungültig </p>}
                </div>
                <Button style={{margin: '.75rem'}} label={"Login"} type={"accent"} height={2.5}
                        width={"calc(100% - 1rem)"}
                        onClick={login}/>
            </Card>
        </div>
    );
}
