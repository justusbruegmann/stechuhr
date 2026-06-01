'use client';

import * as React from 'react';
import styles from './Loader.module.css';
import {Popup} from "@/components/layout/Popup";


interface LoaderProps {
    type: "spinningLoader",
    children?: React.ReactNode;
    onClose: () => void;
    zIndex: number;
    onRegisterClose?: (fn: () => void) => void;
}

export default function Loader({children, type, onClose, zIndex, onRegisterClose}: LoaderProps) {

    const cssClass = type === "spinningLoader" ? styles.spinningLoader : "";

    return (
        <Popup onClose={onClose} zIndex={zIndex} onRegisterClose={onRegisterClose} isLoader={true}>
            <div className={styles.spinningLoader}/>
            {children}
        </Popup>
    );
}
