'use client';

import * as React from 'react';
import Loader from "@/components/layout/Loader";


interface LoaderProps {
    children?: React.ReactNode;
    onClose: () => void;
    zIndex: number;
    onRegisterClose?: (fn: () => void) => void;
}

export default function SpinningLoader({children, onClose, zIndex, onRegisterClose}: LoaderProps) {
    return (
        <Loader type={"spinningLoader"} onClose={onClose} zIndex={zIndex} onRegisterClose={onRegisterClose}>
            {children}
        </Loader>
    );
}
