'use client'
import styles from "./manage.module.css";
import type User from "@/types/User";

import React from "react"

import Button from "@/components/layout/Button";
import Header from "@/components/layout/Header";
import UserItem from "@/components/usermanagement/userItem";
import UserItemHeader from "@/components/usermanagement/userItemHeader";
import Image from "next/image";
import {useModal} from "@/contexts/ModalContext";
import CopyToClipboard from "@/components/usermanagement/CopyToClipboard";

const demoData: User[] = [{id: 1, username: "Aaron", role: "user", managerid: 2},
    {id: 2, username: "Felix", role: "manager", managerid: 2},
    {id: 4, username: "Sebbi", role: "manager", managerid: 2},
    {id: 3, username: "Justus", role: "admin", managerid: 2},]

export default function Manage() {
    const [users, setUsers] = React.useState<User[]>(demoData);
    const {showModal} = useModal();

    //TODO useEffect
    const handleAddUser = () => {
        const username = (document.getElementById("newUsername") as HTMLInputElement).value;
        const role = (document.getElementById("selectRole") as HTMLSelectElement).value;
        const managerId = (document.getElementById("selectManager") as HTMLSelectElement).value;

        if (!username || !role || !managerId) {
            alert("Bitte alle Felder ausfüllen");
            return;
        }

        const newUser: User = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            username,
            role: role as "user" | "manager" | "admin",
            managerid: parseInt(managerId)
        };

        setUsers([...users, newUser]);
    };

    function deleteUser(id: number) {
        setUsers((prev) => {
            const next = [...prev];
            const index = next.findIndex((u) => u.id === id);
            if (index === -1) return prev;

            next.splice(index, 1);
            return next;
        });
    }

    function randomString() :string {
        return Math.random().toString(36).substr(2, 9);
    }



    return (
        <>
            <Header name={"admin"}/>
            <div>
                <div className={styles.rows}>
                    Nutzer
                    <Button label={"Nutzer anlegen"} height={2} width={6} onClick={() => {
                        const {close : closeCreateUserModal} = showModal("popup", <div className={styles.rows}>
                            <h3>Neuen Nutzer anlegen</h3>
                            <input type="text" id={"newUsername"} className={styles.inputs} placeholder={"Nutzername"}/>
                            <select className={styles.inputs} name="selectRole" id="selectRole">
                                <option value="user">Nutzer</option>
                                <option value="manager">Manager</option>
                                <option value="user">Admin</option>
                            </select>
                            <select className={styles.inputs} name="manager" id="selectManager">
                                {users.filter((user: User) => user.role === "manager").map((user: User) => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </select>
                            <Button label={"Anlegen"} type={"accent"} height={2} width={"calc(100% - .75rem)"}
                                    className={styles.inputs} onClick={() => {
                                handleAddUser();
                                closeCreateUserModal();
                                const onetimePassword :string = randomString();
                                 const {close: closePasswordModal} =  showModal("popup", <div>
                                    <h3>Einmalpasswort</h3>
                                     <br/>
                                     <p>Passwort speichern und dem Nutzer zu schicken</p>
                                     <p>Das Passwort wird nur einmal angezeigt</p>
                                     <br/>
                                    <CopyToClipboard text={onetimePassword} />
                                    <Button label={"Anlegen"} type={"accent"} height={2} width={"calc(100% - .75rem)"}
                                            className={styles.inputs} onClick={() => {closePasswordModal()}} />
                                </div>);
                            }}/>
                        </div>)
                    }}/>
                </div>
                <div className={styles["rows"]}>
                    <UserItemHeader/>
                    {users.map((user) => (
                        <UserItem key={user.id} user={user} onDeleteAction={deleteUser} />
                    ))}                </div>
            </div>
        </>
    );
}
