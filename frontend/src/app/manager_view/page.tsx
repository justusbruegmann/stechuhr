'use client'
import User from "@/types/User";

import React, {useEffect} from "react"
import Header from "@/components/layout/Header";
import {useModal} from "@/contexts/ModalContext";
import styles from './manager_view.module.css';


import {getUsersForManager} from "@/scripts/userManagement";
import UserTable from "@/components/managerView/userTable";
import Button from "@/components/layout/Button";
import {useRouter} from "next/navigation";
import {capitalize} from "@/utils/StringUtils";


type UserWithSummaryEntries = User & {
    summaryEntries: {
        vacationDaysThisYear: number | null;
        sickDaysThisYear: number | null;
        hoursWorkedThisWeek: number | null;
    };
};


export default function ManagerView() {
    const router = useRouter();


    /**
     * Loading and storing users
     */
    const {showModal} = useModal();
    const [users, setUsers] = React.useState<Record<number, UserWithSummaryEntries>>({});
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setLoading(true);
        const {close} = showModal("spinningLoader")
        loadUsers().then(_ => {
            close();
            setLoading(false);
        });
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

        if (!Array.isArray(response)) return;

        const extendedUser: Record<number, UserWithSummaryEntries> = response.map((user: User) => ({

            ...user,
            summaryEntries: {
                vacationDaysThisYear: null,
                sickDaysThisYear: null,
                hoursWorkedThisWeek: null
            }
        }));

        setUsers(extendedUser);
    }


    /**
     * Loading summary entries for users
     */




    const columns = ["Name", "Urlaub dieses Jahr", "Krankheitstage dieses Jahr", "Arbeitszeit diese Woche", ""];

    const rows = Object.keys(users).map((id) => {
            const user = users[Number(id)];
            return (
                <tr key={user.id}>
                    <td><b>{capitalize(user.username)}</b></td>
                    <td><b>{(user.summaryEntries.vacationDaysThisYear || "?")}</b> / <b>{user.holidays}</b> Tage</td>
                    <td><b>{user.summaryEntries.sickDaysThisYear || "?"}</b></td>
                    <td><b>{(user.summaryEntries.hoursWorkedThisWeek || "?")}</b> / <b>{user.workload}</b> h</td>
                    <td>
                        <Button label={"KÜNDIGUNG!"} type={"error"}
                                onClick={() => alert(`Mitarbeiter ${user.username} wird gefeuert!`)}/>
                    </td>
                </tr>);
        }
    );


    return (
        <>
            <Header/>

            <div className={styles.tableContainer}>
                {!loading && Object.keys(users).length > 0 &&
                    <UserTable columnNames={columns} rows={rows}/>
                }

                {!loading && Object.keys(users).length == 0 &&
                    <div className={styles.noUsers}>
                        <h2>Sie haben keine Mitarbeiter zu verwalten</h2>
                        <Button label={"Zurück zum Dashboard"} onClick={() => router.push("/dashboard")}/>
                    </div>
                }
            </div>
        </>
    )

}
