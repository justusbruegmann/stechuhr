'use client';
import * as React from 'react';
import styles from './editUserModal.module.css';
import User from "@/types/User";
import {useEffect} from "react";
import {useModal} from "@/contexts/ModalContext";
import {getUserById, getUsersForManager} from "@/scripts/userManagement";

export type EditUserModalProps = {
    userId: number;
    user?: User;
}

export default function EditUserModal({userId, user}: EditUserModalProps) {

    const {showModal} = useModal();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (!user) {
            setLoading(true);
            const {close} = showModal("spinningLoader")
            loadUser().then(_ => {
                close();
                setLoading(false);
            });
        }
    }, []);


    async function loadUser() {
        try {
            user = await getUserById(Number(userId)) as User;
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div>
            Hello
        </div>
    );

}