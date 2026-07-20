'use client'
import User from "@/types/User";
import Request from "@/types/Request";

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
import {startOfTheMonthDateString, startOfTheWeekDateString, todayDateString} from "@/utils/TimeUtils";
import {DateString} from "@/types/misc";
import {getAllRequestsAManagerIsResponsibleFor} from "@/scripts/requests";
import AnswerRequestModal from "@/components/managerView/answerRequestModal";


export type UserWithExtraFields = User & {
    summaryEntries: {
        vacationDaysThisYear: number | null;
        sickDaysThisYear: number | null;
        hoursWorkedThisWeek: number | null;
    },
    openRequests: Request[],
};


export default function ManagerView() {
    const router = useRouter();

    /**
     * Loading and storing users
     */
    const {showModal} = useModal();
    const [users, setUsers] = React.useState<Record<number, UserWithExtraFields>>({});
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        setLoading(true);
        const {close} = showModal("spinningLoader")

        loadUsers()
            .then(_ => {
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

        const summariesMonth = await Promise.all(
            response.map((user: User) => loadSummary(user.id, startOfTheMonthDateString(), todayDateString())
                .catch((e) => {
                        console.error(e);
                        return undefined;
                    }
                ))
        );

        const summariesWeek = await Promise.all(
            response.map((user: User) => loadSummary(user.id, startOfTheWeekDateString(), todayDateString())
                .catch((e) => {
                        console.error(e);
                        return undefined;
                    }
                ))
        );

        const openRequests = await loadRequests();

        const extendedUser: UserWithExtraFields[] = response.map((user: User, index: number) => {
            const summaryMonth = summariesMonth[index];
            const summaryWeek = summariesWeek[index];

            return {
                ...user,
                summaryEntries: {
                    vacationDaysThisYear: summaryMonth?.vacationDaysTaken ?? null,
                    sickDaysThisYear: summaryMonth?.sickDaysTaken ?? null,
                    hoursWorkedThisWeek: summaryWeek ? Math.floor(summaryWeek.timeWorkedInMinutes / 60) : null
                },
                openRequests: openRequests ? openRequests.filter(request => request.userId === user.id) : [],
            };
        });

        const extendedUsers = Object.fromEntries(extendedUser.map(user => [user.id, user]));
        setUsers(extendedUsers);
    }

    async function loadRequests() {
        let requests: Request[] = [];
        try {
            const response: Request[] = await getAllRequestsAManagerIsResponsibleFor();
            if (Array.isArray(response)) {
                requests = response;
            }
        } catch (error) {
            console.error(error);
            return;
        }

        console.log("Response:")
        console.log(requests);
        return requests;
    }


    /**
     * Loading summary entries for users
     */
    const currentYear = new Date().getFullYear();

    async function loadSummary(userId: number, startDate: DateString, endDate: DateString): Promise<Summary | undefined> {
        return await getSummaryForUser(userId, startDate, endDate)
            .catch((e) => {
                console.error(e);
                return undefined;
            });
    }


    /**
     * Editing users
     */
    function generateUserUpdateFunction(userId: number) {
        // This function returns another function with the userId hardcoded into it, which can then be passed into the
        // EditUserModal component to update the local state of the user with the given userId.

        // Yes, I did write this myself. No, I am not sure whether this is the most elegant way. But it works.

        return (updates: Partial<Record<keyof User, any>>): void => {

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


    function updateRequests(userId: number, remainingRequests: Request[]) {
        setUsers(prevUsers => {
            const user = prevUsers[userId];
            if (!user) return prevUsers;

            return {
                ...prevUsers,
                [userId]: {
                    ...user,
                    openRequests: remainingRequests,
                },
            };
        });

        //ToDo: update modal content


        //
        // useEffect(() => {
        //     if (currentlyOpenModal.current) {
        //         if (currentlyOpenModal.current.type === "DailyDetails") {
        //             console.log("Trying to update daily details")
        //             updateModalContent(
        //                 currentlyOpenModal.current.id,
        //                 createDailyDetailsContent(currentlyOpenModal.current.date)
        //             );
        //         } else if (currentlyOpenModal.current.type === "OverviewModal") {
        //             if (currentUser) {
        //                 updateModalContent(
        //                     currentlyOpenModal.current.id,
        //                     createOverviewContent()
        //                 );
        //             }
        //         }
        //     }
        // }, [dailyEntries, updateModalContent]);


    }


    function answerRequests(userId: number) {
        showModal("popup",
            <AnswerRequestModal user={users[userId]} updateLocalState={updateRequests}/> //ToDo: updateLocalState functionality
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
                                    onClick={() => answerRequests(user.id)}/>
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
