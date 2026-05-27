'use client';
import * as React from 'react';
import styles from './userItem.module.css';
import Button from "@/components/layout/Button";
import Image from "next/image";
import type User from "@/types/User";
import {useModal} from "@/contexts/ModalContext";
import {finalizeLayoutVaryPath} from "next/dist/client/components/segment-cache/vary-path";
import {getManagers, updateManager, updateRole} from "@/scripts/userManagement";

type Props = {
    user: User;
    onDeleteAction: (id: number) => void;
    loadUsersAction: () => void;
}

export default function UserItem({user, onDeleteAction, loadUsersAction}: Props) {
    const [isDeleting, setIsDeleting] = React.useState(false);
    const {showModal} = useModal();
    return (
        <>
            <div className={styles.container}>
                <p className={styles.item}>{user.id}</p>
                <p className={styles.item}>{user.username}</p>
                <p className={styles.item}>{user.role}</p>
                <p className={styles.item}>{user.managerid}</p>
                <div className={styles.item}>
                    <Button label={<Image src={"/delete.svg"} alt="delete" width="16" height="16"/>} type={"error"}
                            height={2} width={2} onClick={async () => {
                        if (isDeleting) {
                            alert("Deleting user");
                            return;
                        }
                        setIsDeleting(true);
                        onDeleteAction(user.id)
                    }}/>
                    <Button label={<Image src={"/edit.svg"} alt="delete" width="16" height="16"/>} type={"accent"}
                            height={2} width={2} onClick={async () => {
                        const token = localStorage.getItem("token");
                        const userIdOfAdmin = localStorage.getItem("userid");
                        if (!token || !userIdOfAdmin) {
                            alert("User id or Token is missing!");
                            return;
                        }
                        const managers: any = await getManagers(token, Number(userIdOfAdmin));
                        if (!managers) {
                            alert("No managers found.");
                            return;
                        }
                        const {close} = showModal("popup", <div>
                            <h2>Update Nutzer</h2>
                            <p>Hier können Eigenschaften von Nutzern bearbeitet werden</p>
                            <br/>
                            <br/>
                            <div className={styles.rows}>
                                <h4>Rolle:</h4>
                                <select className={styles.inputs} name="Rolle" id="selectRole">
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">user</option>
                                </select>
                                <h4>Manager:</h4>
                                <select className={styles.inputs} name="Managers" id="selectManager">
                                    {managers.map((manager: any) => (
                                        <option key={manager.id} value={manager.id}>{manager.username}</option>))}
                                </select>
                                <div className={styles.rows}>
                                    <Button label={"Abbrechen"} type={"error"} height={3} width={8} onClick={() => {close()}}/>
                                    <Button label={"Bestätige"} type={"success"} height={3} width={8} onClick={async () => {
                                        const role = (document.getElementById("selectRole") as HTMLSelectElement).value;
                                        const managerId = (document.getElementById("selectManager") as HTMLSelectElement).value;

                                        const managerUpdate = await updateManager(user.id,Number(managerId), token,Number(userIdOfAdmin))
                                        const roleUpdate = await updateRole(user.id,role, token,Number(userIdOfAdmin))

                                        if (managerUpdate === 204 && roleUpdate === 204) {
                                            loadUsersAction();
                                            close()
                                            return;
                                        }
                                        alert("ein Fehler ist auf gekommen")
                                    }}/>
                                </div>
                            </div>

                        </div>);


                    }}/>
                </div>
            </div>
        </>
    );
}