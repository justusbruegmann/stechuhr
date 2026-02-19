"use client";

import {createContext, ReactNode, useContext, useState} from "react";
import {Sidepane} from "@/components/layout/Sidepane";
import {Popup} from "@/components/layout/Popup";

interface ModalContextType {
    showModal: (type: "sidepane" | "popup", content: ReactNode) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({children}: { children: ReactNode }) {
    const [modalContentComponent, setModalContentComponent] = useState<ReactNode | null>(null);
    const [modalType, setModalType] = useState<"sidepane" | "popup">("sidepane");

    const showModal = (type: "sidepane" | "popup", content: ReactNode) => {
        setModalType(type);
        setModalContentComponent(content);
    };
    const hideModal = () => setModalContentComponent(null);
    const value = {showModal, hideModal};

    return (
        <ModalContext.Provider value={value}>
            {children}
            {modalContentComponent && modalType === "sidepane" && (
                <Sidepane onClose={hideModal}>
                    {modalContentComponent}
                </Sidepane>
            )}
            {modalContentComponent && modalType === "popup" && (
                <Popup onClose={hideModal}>
                    {modalContentComponent}
                </Popup>
            )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal cannot be used outside ModalProvider");
    return context;
}
