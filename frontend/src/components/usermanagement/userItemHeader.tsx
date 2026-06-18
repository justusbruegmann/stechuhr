'use client';
import * as React from 'react';
import styles from './userItem.module.css';


export default function UserItemHeader() {

    return (
        <>
            <div className={styles.container}>
                <p className={styles.item}>id</p>
                <p className={styles.item}>Nutzername</p>
                <p className={styles.item}>Rolle</p>
                <p className={styles.item}>Manager</p>
                <p className={styles.item}>Workload</p>
                <p className={styles.item}>Holidays</p>
                <p className={styles.item}>Actions</p>
            </div>
        </>
    );
}