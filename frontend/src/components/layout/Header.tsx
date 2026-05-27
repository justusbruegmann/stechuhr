'use client';
// src/components/Button.tsx
import React from 'react';
import styles from './Header.module.css';
import Button from "@/components/layout/Button";
import {useRouter} from "next/navigation";
import Image from "next/image";

type Headerprops = {
    name: string;
}

export default function Header({name}: Headerprops) {
    const router = useRouter();
    const [userRole, setUserRole] = React.useState<string | null>(null);

    React.useEffect(() => {
        setUserRole(localStorage.getItem("role"));
    }, []);
    const logout = () => {
        // Logout Logik
        router.push("/login");
        localStorage.clear();
    }

    const adminView = () => {
        if (name === "admin") {
            router.push("/dashboard");
        } else {
            router.push("/login/manage");
        }
    }


    return (
        <>
            <div className={styles['background']}>
                <Button label={"Logout"} type={"primary"} height={2} width={6}
                        onClick={() => logout()}/>
                <Image
                    src={`/person_icon.svg`}
                    alt="person_icon"
                    width={32}
                    height={32}
                    style={{filter: 'invert()', opacity: 1}}
                    priority
                />
                {userRole === "admin" &&
                    <Button label={name === "admin" ? "Dashboard" : "Admin ansicht"} type={"primary"} height={2}
                            width={6} onClick={() => adminView()}/>
                }
            </div>
            <hr className={styles["hr-color"]}></hr>
        </>
    );
}