'use client';

import {createPortal} from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import styles from './Popup.module.css';
import Card from "@/components/layout/Card";

interface PopupProps {
    children: React.ReactNode;
    onClose: () => void;
    zIndex: number;
    onRegisterClose?: (fn: () => void) => void;
}

function parseCssTimeToMs(value: string): number {
    const v = value.trim();
    if (!v) return 0;
    if (v.endsWith("ms")) return Number.parseFloat(v);
    if (v.endsWith("s")) return Number.parseFloat(v) * 1000;
    // fallback: assume ms if unit missing
    return Number.parseFloat(v);
}

export function Popup({children, onClose, zIndex, onRegisterClose}: PopupProps) {
    const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);

    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [closeDelayMs, setCloseDelayMs] = useState(300);

    const handleClose = () => {
        setIsClosing(true); // start slide-out animation
    };

    // Register handleClose callback with parent context
    useEffect(() => {
        onRegisterClose?.(handleClose);
    }, [onRegisterClose, handleClose]);

    // Read the CSS variable once the overlay element exists in the DOM
    useEffect(() => {
        const el = overlayRef.current;
        if (!el) return;

        const raw = getComputedStyle(el).getPropertyValue("--popup-animation-duration");
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

    const styleOverrides = {padding: '0px', margin: '.5rem', boxShadow: 'none', zIndex: zIndex + 1};

    return createPortal(
        <div className={`${styles["overlay-background"]} ${isClosing ? styles["fade-out"] : ""}`} onClick={handleClose}
             ref={overlayRef} style={{zIndex: zIndex}}>
            <Card className={`${styles["popup-container"]} ${isClosing ? styles["pop-out"] : ""}`}
                  onClick={(e) => e.stopPropagation()}>
                <Card className={`${styles["close-button"]}`} styleOverrides={styleOverrides} onClick={handleClose}>
                    ×
                </Card>
                {children}
            </Card>
        </div>,
        portalRoot
    );
}
