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
import EditUserModal from "@/components/managerView/editUserModal";


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
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        setLoading(true);
        const {close} = showModal("spinningLoader")

        loadUsers()
            .then(_ => {
                close();
                setLoading(false);
            })
            .catch(error => {
                setUsers({});
                close();
                setLoading(false);
            });
    }, []);

    async function loadUsers() {
        const response: User[] = await getUsersForManager();

        if (!Array.isArray(response)) return;

        const extendedUser: UserWithSummaryEntries[] = response.map((user: User) => ({
            ...user,
            summaryEntries: {
                vacationDaysThisYear: null,
                sickDaysThisYear: null,
                hoursWorkedThisWeek: null
            }
        }));

        const usersRecord = Object.fromEntries(extendedUser.map(user => [user.id, user]));
        setUsers(usersRecord);
    }


    /**
     * Loading summary entries for users
     */
    const currentYear = new Date().getFullYear();


    /**
     * Editing users
     */
    function generateUserUpdateFunction(userId: number) {
        return (updates: Partial<Record<keyof User, any>>): void => {

            console.log(`Saving changes ${updates} to user ${userId}`);

            setUsers(prevUsers => {
                const updatedUser = {
                    ...prevUsers[userId],
                    ...updates
                };
                return {
                    ...prevUsers,
                    [userId]: updatedUser
                };
            });
        }
    }


    function editUser(userId: number) {
        showModal("popup",
            <EditUserModal userId={userId}
                           user={users[userId]}
                           updateLocalState={generateUserUpdateFunction(userId)}
            />
        );
    }


    const columns = ["Name", `Urlaub (${currentYear})`, `Krankheitstage (${currentYear})`, "Arbeitszeit diese Woche", ""];

    const rows = Object.keys(users).map((id) => {
            const user = users[Number(id)];
            return (
                <tr key={user.id}>
                    <td><b>{capitalize(user.username)}</b></td>
                    <td><b>{(user.summaryEntries.vacationDaysThisYear || "?")}</b> / <b>{user.holidays}</b> Tage</td>
                    <td><b>{user.summaryEntries.sickDaysThisYear || "?"}</b></td>
                    <td><b>{(user.summaryEntries.hoursWorkedThisWeek || "?")}</b> / <b>{user.workload}</b> h</td>
                    <td>
                        <div className={styles.buttonContainer}>
                            <Button label={"Bearbeiten"} type={"primary"}
                                    onClick={() => editUser(user.id)}/>
                            <Button label={"Anträge"} type={"accent"}
                                    onClick={() => alert(`Mitarbeiter ${user.username} wird gefeuert!`)}/>
                        </div>
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
