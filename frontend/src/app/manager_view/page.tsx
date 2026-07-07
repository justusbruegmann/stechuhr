'use client'
import styles from "./manager_view.module.css";
import User from "@/types/User";

import React, {useEffect, useState} from "react"

import Button from "@/components/layout/Button";
import Header from "@/components/layout/Header";
import UserItem from "@/components/usermanagement/userItem";
import UserItemHeader from "@/components/usermanagement/userItemHeader";
import {useModal} from "@/contexts/ModalContext";
import CopyToClipboard from "@/components/usermanagement/CopyToClipboard";

import {getUsers, createUser, deleteUser, getManagers, getUsersForManager} from "@/scripts/userManagement";


export default function ManagerView() {
    const {showModal, updateModalContent} = useModal();
    const [users, setUsers] = React.useState<User[]>([]);

    useEffect(() => {
        const {close} = showModal("spinningLoader")
        loadUsers().then(r => close());
    }, []);

    async function loadUsers() {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if (!token || !userid) {
            return;
        }
        const response: User[] = await getUsersForManager(token, Number(userid), Number(userid));

        console.log("Response");
        console.log(response);

        setUsers(response);
    }

    const handleAddUser = async () => {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if (!token || !userid) {
            return;
        }
        const username = (document.getElementById("newUsername") as HTMLInputElement).value;
        const role = (document.getElementById("selectRole") as HTMLSelectElement).value;
        const managerId = (document.getElementById("selectManager") as HTMLSelectElement).value;
        const workload = (document.getElementById("workloadInput") as HTMLSelectElement).value;
        const holidays = (document.getElementById("holidaysInput") as HTMLSelectElement).value;

        if (!username || !role || !managerId) {
            alert("Bitte alle Felder ausfüllen");
            return;
        }
        try {
            const result = await createUser(
                username,
                Number(managerId),
                role,
                Number(workload),
                Number(holidays),
                token,
                Number(userid)
            );

            if (typeof result === "string") {
                await loadUsers();
                return result;
            }
        } catch (e) {
            alert(e)
        }
    };

    async function deleteUserFrontend(id: number) {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("userid");
        if (!token || !userid) {
            return;
        }
        const result = await deleteUser(token, Number(userid), Number(id));
        await loadUsers();
        if (result !== 200) {
            alert("There was an error while deleting user");
        }
    }





    return (
        <>
            <Header/>
            <div>
                <div className={styles.rows}>
                    Nutzer
                    <Button label={"Nutzer anlegen"} height={2} width={6} onClick={() => {
                        let createModalId: string;
                        let closeCreateUserModal: () => void;

                        const handleAnlegen = async () => {
                            updateModalContent(createModalId, buildCreateContent(true));
                            const onetimePassword = await handleAddUser();
                            if (!onetimePassword) {
                                updateModalContent(createModalId, buildCreateContent(false));
                                return;
                            }
                            closeCreateUserModal();
                            const {close: closePasswordModal} = showModal("popup", <div>
                                <h3>Einmalpasswort</h3>
                                <br/>
                                <p>Passwort speichern und dem Nutzer zu schicken</p>
                                <p>Das Passwort wird nur einmal angezeigt</p>
                                <br/>
                                <CopyToClipboard text={onetimePassword}/>
                                <Button label={"Schließen"} type={"accent"} height={2}
                                        width={"calc(100% - .75rem)"}
                                        className={styles.inputs} onClick={() => closePasswordModal()}/>
                            </div>);
                        };

                        const buildCreateContent = (loading: boolean) => (
                            <div className={styles.rows}>
                                <h3>Neuen Nutzer anlegen</h3>
                                <input type="text" id={"newUsername"} className={styles.inputs}
                                       placeholder={"Nutzername"}/>
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
                                <input type="number" id={"workloadInput"} className={styles.inputs}
                                       placeholder={"Number of workloads in H"}/>
                                <input type="number" id={"holidaysInput"} className={styles.inputs}
                                       placeholder={"Number of holidays in Days"}/>
                                <Button label={"Anlegen"} type={"accent"} height={2} width={"calc(100% - .75rem)"}
                                        className={styles.inputs} loading={loading} onClick={handleAnlegen}/>
                            </div>
                        );

                        ({
                            id: createModalId,
                            close: closeCreateUserModal
                        } = showModal("popup", buildCreateContent(false)));
                    }}/>
                </div>
                <div className={styles["rows"]}>
                    <UserItemHeader/>
                    {users.map((user) => (
                        <p>{user.username}</p>
                    ))}
                </div>
            </div>
        </>
    );
}
