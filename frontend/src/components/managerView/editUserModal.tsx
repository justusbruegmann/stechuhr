'use client';
import * as React from 'react';
import {useEffect} from 'react';
import User from "@/types/User";
import {getUserById, updateUser} from "@/scripts/userManagement";
import {capitalize} from "@/utils/StringUtils";
import styles from './editUserModal.module.css';
import Button from "@/components/layout/Button";
import {useCurrentModal} from "@/contexts/ModalContext";


export type EditUserModalProps = {
    userId: number;
    user?: User;
    updateLocalState?: (newEntries: Partial<Record<keyof User, any>>) => void;
}

export default function EditUserModal({userId, user, updateLocalState}: EditUserModalProps) {

    const {close} = useCurrentModal()

    const [loading, setLoading] = React.useState(false);
    const [userState, setUserState] = React.useState<User | null>(user || null);

    useEffect(() => {
        if (!userState) {
            setLoading(true);
            loadUser().then(_ => {
                setLoading(false);
            });
        }
    }, []);


    async function loadUser() {
        try {
            setUserState(await getUserById(Number(userId)) as User);
        } catch (error) {
            console.error(error);
        }
    }


    async function save() {

        const updates = {
            holidays: Number((document.getElementById("vacationDays") as HTMLInputElement).value),
            workload: Number((document.getElementById("workload") as HTMLInputElement).value)
        }

        if (updates.holidays == userState?.holidays && updates.workload == userState?.workload) {
            setLoading(false);
            close();
            return
        }

        setLoading(true);

        await updateUser(userId, updates)
            .then(_ => {

                if (updateLocalState) {
                    updateLocalState(updates);
                }
            })
            .catch(e => {
                console.error(e);
            })

        setLoading(false);
        close();
    }


    return <>
        {
            loading &&
            <div className="loading">Loading ...</div>
        }
        {!loading &&
            <div className={styles.container}>
                <h2 className={styles.header}>
                    {capitalize((userState?.username || "Loading..."))}
                </h2>

                <hr className={styles.separator}/>

                <div className={styles.row}>
                    <p><b>Urlaubstage</b></p>
                    <input type="number" id="vacationDays" name="Vacation Days" min="0" max="365"
                           defaultValue={userState?.holidays}/>
                </div>
                <div className={styles.row}>
                    <p><b>Arbeitszeit</b></p>
                    <input type="number" id="workload" name="Workload" min="0" max="168"
                           defaultValue={userState?.workload}/>
                </div>

                <div className={styles.footer}>
                    <Button label={"Speichern"} type={"accent"} onClick={() => save()}/>
                    <Button label={"Abbrechen"} type={"primary"} onClick={() => close()}/>
                </div>
            </div>
        }
    </>


}