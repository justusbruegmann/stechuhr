"use client";

import { createPortal } from "react-dom";
import React, {useEffect, useState} from "react";

interface SidepaneOverlayProps {
    children: React.ReactNode;
    onClose: () => void;
}

export function SidepaneOverlay({ children, onClose }: SidepaneOverlayProps) {
    const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);

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
        <div style={overlayStyle} onClick={onClose}>
            {children}
        </div>,
        portalRoot
    );
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 2147483647,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "2rem",
};