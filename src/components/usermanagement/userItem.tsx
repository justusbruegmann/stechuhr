'use client';
import * as React from 'react';
import styles from './userItem.module.css';
import Button from "@/components/layout/Button";
import {useRouter} from "next/navigation";
import Image from "next/image";
import type User from "@/types/User";

type Props = {
    user: User;
    onDeleteAction: (id: number) => void;
}

export default function UserItem({user, onDeleteAction}: Props) {

    return (
        <>
            <div className={styles.container}>
                <p className={styles.item}>{user.id}</p>
                <p className={styles.item}>{user.username}</p>
                <p className={styles.item}>{user.role}</p>
                <p className={styles.item}>{user.managerid}</p>
                <div className={styles.item}>
                    <Button label={<Image src={"/delete.svg"} alt="delete" width="16" height="16"/>} type={"error"}
                            height={2} width={2} onClick={() => {onDeleteAction(user.id)}} />
                </div>
            </div>
        </>
    );
}