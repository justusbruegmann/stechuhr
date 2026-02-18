'use client'

import Button from "@/components/Button";

import Image from "next/image";

import styles from "./Login.module.css"

export default function Page() {
    return (
        <div className={`${styles.container}`}>
            <div className={`${styles["login-page"]}`}>
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
                <input type="text" id="usernameInput" className={`${styles["login-input"]}`} placeholder="Username"/>
                <input type="password" id="passwordInput" className={`${styles["login-input"]}`}
                       placeholder="Password"/>
                <Button style={{margin: '.75rem'}} label={"Page"} type={"accent"} height={2.5} width={"calc(100%-1rem)"}
                        onClick={() => {
                            alert("Page")
                        }}/>
            </div>
        </div>
    );
}
