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
import Summary from "@/types/summary";
import {getSummaryForUser} from "@/scripts/summary";


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
                console.log(users);
                close();
                setLoading(false);
            })
            .catch(_ => {
                setUsers({});
                close();
                setLoading(false);
            });
    }, []);

    async function loadUsers() {
        const response: User[] = await getUsersForManager();

        if (!Array.isArray(response)) return;

        const summaries = await Promise.all(
            response.map((user: User) => loadSummary(user.id))
        );

        const extendedUser: UserWithSummaryEntries[] = response.map((user: User, index: number) => {
            const summary = summaries[index];

            console.log(`Loaded summary for user ${user.id}: ${JSON.stringify(summary)}`);

            return {
                ...user,
                summaryEntries: {
                    vacationDaysThisYear: summary?.vacationDaysTaken ?? null,
                    sickDaysThisYear: summary?.sickDaysTaken ?? null,
                    hoursWorkedThisWeek: summary ? Math.floor(summary.timeWorkedInMinutes / 60) : null
                }
            };
        });

        console.log(`Extended users object: ${JSON.stringify(extendedUser)}`);

        const extendedUsers = Object.fromEntries(extendedUser.map(user => [user.id, user]));
        setUsers(extendedUsers);
    }


    /**
     * Loading summary entries for users
     */
    const currentYear = new Date().getFullYear();

    async function loadSummary(userId: number): Promise<Summary | undefined> {
        return await getSummaryForUser(userId, "2026-01-01", "2026-07-01")
            .catch((e) => {
                console.error(e);
                return undefined;
            });
    }


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
                    <td><b>{capitalize(user.username ?? "")}</b></td>
                    <td className={(user.summaryEntries.vacationDaysThisYear ?? Number.MAX_VALUE) > user.holidays ? styles.warning : ""}>
                        <b>{(user.summaryEntries.vacationDaysThisYear ?? "?")}</b> / <b>{user.holidays}</b> Tage
                    </td>
                    <td>
                        <b>{user.summaryEntries.sickDaysThisYear ?? "?"}</b>
                    </td>
                    <td className={(user.summaryEntries.hoursWorkedThisWeek ?? Number.MAX_VALUE) > user.workload ? styles.warning : ""}>
                        <b>{(user.summaryEntries.hoursWorkedThisWeek ?? "?")}</b> / <b>{user.workload}</b> h
                    </td>
                    <td>
                        <div className={styles.buttonContainer}>
                            <Button label={"Bearbeiten"} type={"primary"}
                                    onClick={() => editUser(user.id)}/>
                            <Button label={"Anträge"} type={"accent"}
                                    onClick={() => console.log("Darf ich bitte bitte früher gehen?")}/>
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
