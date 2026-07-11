'use client';
import * as React from 'react';
import styles from './userTable.module.css';

export type UserTableProps = {
    columnNames?: string[];
    rows?: React.ReactNode[];
}

export default function UserTable({columnNames, rows}: UserTableProps) {
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                <tr>
                    {columnNames &&
                        columnNames.map((item, i) => (
                            <th key={i}>{item}</th>
                        ))
                    }
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>
    );
}