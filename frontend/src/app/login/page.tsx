'use client';

import Button from "@/components/layout/Button";
import Card from "@/components/layout/Card";
import {useModal} from "@/contexts/ModalContext"
import Image from "next/image";
import styles from "./Login.module.css"
import {PasswordChangeModal} from "@/components/login/PasswordChangeModal";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {loginUsername} from "@/scripts/auth";



export default function Page(){
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [validInputs, setValidInputs] = useState<boolean>(true);
    const [isDoing, setIsDoing] = useState(false);

    const [width, setWidth] = useState("20vw");
    const {showModal} = useModal();

    //this useeffect AI geratet to center the card with window size
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

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isDoing) {
            await login();
        }
    };

    const login = async () => {
        setIsDoing(true);
        if (username.trim() && password.trim()) {
            // Logic for BE login
            let result: any;
            try {
                result = await loginUsername(username.trim(), password.trim());
            } catch (e) {
                console.error(e);
            }
            setValidInputs(true);
            if (result === 401 || result === 400 || !result) {
                setValidInputs(false);
                setIsDoing(false);
                return;
            }
            if (result?.status === 485) {
                setIsDoing(false);
                const {close} = showModal("popup",
                    <PasswordChangeModal
                        password={password}
                        userId={result.response.userId}
                        // just give the chilt the function
                        onSuccess={() => {
                            close();
                            router.push("/login");
                        }}
                    />
                );

            } else {
                // valid login
                localStorage.setItem("role", result.role);
                localStorage.setItem("userid", result.id);
                localStorage.setItem("token", result.session);
                router.push("/dashboard")
            }


        } else {
            setValidInputs(false);
            setIsDoing(false);
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
                       onChange={(e) => setUsername(e.target.value)}   onKeyDown={handleEnter}/>
                <input type="password" id="passwordInput" className={`${styles["login-input"]}`}
                       placeholder="  Password" onChange={(e) => setPassword(e.target.value)}   onKeyDown={handleEnter}/>
                <div className={`${styles["login-center"]}`}>
                    {!validInputs && <p className={styles.invalidUsername}>Nutzername und Passwort sind ungültig </p>}
                </div>
                <Button style={{margin: '.75rem'}} label={"Login"} type={"accent"} height={2.5}
                        width={"calc(100% - 1rem)"}
                        onClick={login} loading={isDoing}
                />
            </Card>
        </div>
    );
}
