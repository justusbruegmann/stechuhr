'use client';
import * as React from 'react';
import {useEffect} from 'react';
import User from "@/types/User";
import {getUserById} from "@/scripts/userManagement";
import {capitalize} from "@/utils/StringUtils";
import styles from './editUserModal.module.css';
import Button from "@/components/layout/Button";


export type EditUserModalProps = {
    userId: number;
    user?: User;
}

export default function EditUserModal({userId, user}: EditUserModalProps) {

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

                <hr className={styles.separator} />

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
                    <Button label={"Speichern"} type={"accent"} onClick={() => {console.log("Saving!")}} />
                    <Button label={"Abbrechen"} type={"primary"} onClick={() => {console.log("Close")}} />
                </div>
            </div>
        }
    </>


}