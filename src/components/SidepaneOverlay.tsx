"use client";

import { createPortal } from "react-dom";
import React, {useEffect, useState} from "react";
import styles from './SidepaneOverlay.module.css';

interface SidepaneOverlayProps {
    children: React.ReactNode;
    onClose: () => void;
}

export function SidepaneOverlay({ children, onClose }: SidepaneOverlayProps) {
    const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);

    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true); // start slide-out animation
    };

    // When animation ends, call onClose() provided by SidepaneContext
    useEffect(() => {
        if (!isClosing) return;

        const timer = setTimeout(() => {
            onClose();
        }, 300);

        return () => clearTimeout(timer);
    }, [isClosing, onClose]);



    useEffect(() => {
        if (typeof document === "undefined") return;

        const container = document.createElement("div");
        document.body.appendChild(container);
        setPortalRoot(container);

        return () => {
            document.body.removeChild(container);
        };
    }, []);

    if (!portalRoot) return null;

    return createPortal(
        <div className={`${styles["overlay-background"]} ${isClosing ? styles["fade-out"] : ""}`} onClick={handleClose}>
            <div className={`${styles["sidepane-container"]} ${isClosing ? styles["slide-out"] : ""}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        portalRoot
    );
}
