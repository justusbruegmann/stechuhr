'use client';
// src/components/Button.tsx
import * as React from 'react';
import styles from './userItem.module.css';
import Button from "@/components/layout/Button";
import {useRouter} from "next/navigation";
import Image from "next/image";
import type User from "@/types/User";

export default function UserItemHeader() {

    return (
        <>
            <div className={styles.container}>
                <p className={styles.item}>id</p>
                <p className={styles.item}>Nutzername</p>
                <p className={styles.item}>Rolle</p>
                <p className={styles.item}>Manager id</p>
            </div>
        </>
    );
}