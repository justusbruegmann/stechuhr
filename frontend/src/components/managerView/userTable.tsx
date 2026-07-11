'use client';
import * as React from 'react';


export type UserTableProps = {
    columnNames?: String[];
    rows?: React.ReactNode[];
}

export default function UserTable({columnNames, rows}: UserTableProps) {

    return (
        <>
            <table>
                <thead>
                <tr>
                    {columnNames &&
                        columnNames.map((item, i) => (
                            <th id={i.toString()}>{item}</th>
                        ))
                    }
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        </>
    );
}