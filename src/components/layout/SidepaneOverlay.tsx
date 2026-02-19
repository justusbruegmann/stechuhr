"use client";

import {createPortal} from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import styles from './SidepaneOverlay.module.css';

interface SidepaneOverlayProps {
    children: React.ReactNode;
    onClose: () => void;
}

function parseCssTimeToMs(value: string): number {
    const v = value.trim();
    if (!v) return 0;
    if (v.endsWith("ms")) return Number.parseFloat(v);
    if (v.endsWith("s")) return Number.parseFloat(v) * 1000;
    // fallback: assume ms if unit missing
    return Number.parseFloat(v);
}

export function SidepaneOverlay({children, onClose}: SidepaneOverlayProps) {
    const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);

    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [closeDelayMs, setCloseDelayMs] = useState(300);

    const handleClose = () => {
        setIsClosing(true); // start slide-out animation
    };

    // Read the CSS variable once the overlay element exists in the DOM
    useEffect(() => {
        const el = overlayRef.current;
        if (!el) return;

        const raw = getComputedStyle(el).getPropertyValue("--sidepane-animation-duration");
        const ms = parseCssTimeToMs(raw);

        if (Number.isFinite(ms) && ms > 0) {
            setCloseDelayMs(ms);
        }
    }, [portalRoot]);

    // When animation ends, call onClose() provided by SidepaneContext
    useEffect(() => {
        if (!isClosing) return;

        const timer = window.setTimeout(() => {
            onClose();
        }, closeDelayMs);

        return () => window.clearTimeout(timer);
    }, [isClosing, onClose, closeDelayMs]);


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
        <div className={`${styles["overlay-background"]} ${isClosing ? styles["fade-out"] : ""}`} onClick={handleClose}
             ref={overlayRef}>
            <div className={`${styles["sidepane-container"]} ${isClosing ? styles["slide-out"] : ""}`}
                 onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        portalRoot
    );
}
