"use client";

import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import { SidepaneOverlay } from "@/components/SidepaneOverlay";

interface SidepaneContextType {
    showSidepane: (content: ReactNode) => void;
    hideSidepane: () => void;
}

const SidepaneContext = createContext<SidepaneContextType | undefined>(undefined);

export default function SidepaneProvider({ children }: { children: ReactNode }) {
    const [sidepaneContentComponent, setSidepaneContentComponent] = useState<ReactNode | null>(null);

    const showSidepane = (content: ReactNode) => setSidepaneContentComponent(content);
    const hideSidepane = () => setSidepaneContentComponent(null);
    const value = useMemo(() => ({ showSidepane, hideSidepane }), []);

    return (
        <SidepaneContext.Provider value={value}>
            {children}
            {sidepaneContentComponent && (
                <SidepaneOverlay onClose={hideSidepane}>
                    {sidepaneContentComponent}
                </SidepaneOverlay>
            )}
        </SidepaneContext.Provider>
    );
}

export function useSidepane() {
    const context = useContext(SidepaneContext);
    if (!context) throw new Error("useSidepane cannot be used outside OverlayProvider");
    return context;
}
