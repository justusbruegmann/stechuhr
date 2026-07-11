'use client'
import User from "@/types/User";

import React, {useEffect} from "react"
import Header from "@/components/layout/Header";
import {useModal} from "@/contexts/ModalContext";
import styles from './manager_view.module.css';


import {createUser, deleteUser, getUsersForManager} from "@/scripts/userManagement";
import UserTable from "@/components/managerView/userTable";
import Button from "@/components/layout/Button";
import {useRouter} from "next/navigation";


export default function ManagerView() {
    const router = useRouter();

    const {showModal, updateModalContent} = useModal();
    const [users, setUsers] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setLoading(true);
        const {close} = showModal("spinningLoader")
        loadUsers().then(r => {
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


    const columns = ["Name", "Rolle", "Urlaub", "Arbeitszeit", "Krankheitstage", ""];

    const rows = users.map((user) => (
        <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>{user.holidays}</td>
            <td>{user.workload}</td>
            <td>0</td>
            <td>
                <Button label={"KÜNDIGUNG!"} type={"error"}
                        onClick={() => alert(`Mitarbeiter ${user.username} wird gefeuert!`)}/>
            </td>
        </tr>
    ))


    return (
        <>
            <Header/>

            <div className={styles.tableContainer}>
                {!loading && users.length > 0 &&
                    <UserTable columnNames={columns} rows={rows}/>
                }

                {!loading && users.length == 0 &&
                    <div className={styles.noUsers}>
                        <h2>Sie haben keine Mitarbeiter zu verwalten</h2>
                        <Button label={"Zurück zum Dashboard"} onClick={() => router.push("/dashboard")}/>
                    </div>
                }
            </div>
        </>
    )

}
