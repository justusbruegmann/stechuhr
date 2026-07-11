'use client'
import User from "@/types/User";

import React, {useEffect} from "react"
import Header from "@/components/layout/Header";
import {useModal} from "@/contexts/ModalContext";

import {createUser, deleteUser, getUsersForManager} from "@/scripts/userManagement";
import UserTable from "@/components/managerView/userTable";
import Button from "@/components/layout/Button";


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
                <Button label={"KÜNDIGUNG!"} type={"error"} onClick={() => alert(`Mitarbeiter ${user.username} wird gefeuert!`)}/>
            </td>
        </tr>
    ))


    return (
        <>
            <Header/>
            <div className="tableContainer">
                <UserTable columnNames={columns} rows={rows}/>
            </div>
        </>
    )

}
