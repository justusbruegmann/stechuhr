"use client";

import {createPortal} from "react-dom";
import React, {useEffect, useRef, useState, CSSProperties} from "react";
import styles from './PopupOverlay.module.css';
import Card from "@/components/layout/Card";

interface PopupProps {
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

export function Popup({children, onClose}: PopupProps) {
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

        const raw = getComputedStyle(el).getPropertyValue("--Popup-animation-duration");
        const ms = parseCssTimeToMs(raw);

        if (Number.isFinite(ms) && ms > 0) {
            setCloseDelayMs(ms);
        }
    }, [portalRoot]);

    // When animation ends, call onClose() provided by PopupContext
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
            <div className={`${styles["popup-container"]} ${isClosing ? styles["pop-out"] : ""}` }
                 onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        portalRoot
    );
}
