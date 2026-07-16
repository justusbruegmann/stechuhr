'use client';
// src/components/Button.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Button from "@/components/layout/Button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

type HeaderProps = {
    name?: string;
    onNotificationsClick?: () => void;
}

export default function Header({ name, onNotificationsClick }: HeaderProps) {

    const LOGIN = "/login"
    const DASHBOARD = "/dashboard";
    const ADMIN_VIEW = "/login/manage";
    const MANAGER_VIEW = "/manager_view";

    const currentPath = usePathname();

    const router = useRouter();
    const [userRole, setUserRole] = React.useState<string | null>(null);

    React.useEffect(() => {
        setUserRole(localStorage.getItem("role"));
    }, []);
    const logout = () => {
        // Logout logic
        router.push(LOGIN);
        localStorage.clear();
    }

    const adminView = () => {
        if (name === "admin") {
            router.push(DASHBOARD);
        } else {
            router.push(ADMIN_VIEW);
        }
    }


    const [managerViewButtonText, setManagerViewButtonText] = useState("Manager-Ansicht")
    useEffect(() => {
        setManagerViewButtonText(currentPath === MANAGER_VIEW ? "Dashboard" : "Manager-Ansicht")
    }, [currentPath]);

    const toggleManagerView = () => {
        if (currentPath === DASHBOARD) {
            router.push(MANAGER_VIEW);
        } else {
            router.push(DASHBOARD);
        }
    }


    return (
        <>
            <div className={styles['background']}>

                <div className={styles['navigation']}>
                    {currentPath !== LOGIN && userRole === "admin" &&
                        <Button label={name === "admin" ? "Dashboard" : "Admin-Ansicht"} type={"primary"} height={2}
                            width={6} onClick={() => adminView()} />
                    }
                    {currentPath !== LOGIN && userRole === "manager" &&
                        <Button label={managerViewButtonText} type={"primary"} height={2}
                            width={6} style={{ marginRight: 12 }} onClick={() => toggleManagerView()} />
                    }
                </div>

                <div onClick={onNotificationsClick} style={{ cursor: "pointer" }}>
                    <Image
                        src={`/notifications.svg`}
                        alt="notifications_icon"
                        width={32}
                        height={32}
                        style={{ filter: 'invert()', opacity: 1 }}
                        priority
                    />
                </div>

                <div className={styles['login-indicator']}>
                    <Image
                        src={`/person_icon.svg`}
                        alt="person_icon"
                        width={32}
                        height={32}
                        style={{ filter: 'invert()', opacity: 1 }}
                        priority
                    />

                    <Button label={"Logout"} type={"primary"} height={2} width={6}
                        onClick={() => logout()} />
                </div>
            </div >
            <hr className={styles["hr-color"]}></hr>
        </>
    );
}