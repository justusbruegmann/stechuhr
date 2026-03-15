'use client';
// src/components/Button.tsx
import * as React from 'react';
import styles from './userItem.module.css';
import Button from "@/components/layout/Button";
import {useRouter} from "next/navigation";
import Image from "next/image";
import type User from "@/types/User";

export default function userItem(props: User) {

    return (
        <>
            <div className={styles.container}>
                <p className={styles.item}>{props.id}</p>
                <p className={styles.item}>{props.username}</p>
                <p className={styles.item}>{props.role}</p>
                <p className={styles.item}>{props.managerid}</p>
            </div>
        </>
    );
}