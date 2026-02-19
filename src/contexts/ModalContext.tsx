"use client";

import {createContext, ReactNode, useContext, useState, useCallback} from "react";
import {Sidepane} from "@/components/layout/Sidepane";
import {Popup} from "@/components/layout/Popup";

interface Modal {
    id: string;
    type: "sidepane" | "popup";
    content: ReactNode;
}

interface ModalContextType {
    showModal: (type: "sidepane" | "popup", content: ReactNode) => string;
    hideModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({children}: { children: ReactNode }) {
    const [modals, setModals] = useState<Modal[]>([]);

    const showModal = useCallback((type: "sidepane" | "popup", content: ReactNode): string => {
        const id = `modal-${Date.now()}-${Math.random()}`;
        setModals(prevModals => [...prevModals, { id, type, content }]);
        return id;
    }, []);

    const hideModal = useCallback((id: string) => {
        setModals(prevModals => prevModals.filter(modal => modal.id !== id));
    }, []);

    const value = { showModal, hideModal };

    return (
        <ModalContext.Provider value={value}>
            {children}
            {modals.map((modal, index) => {
                const zIndex = 1000 + index;
                return modal.type === "sidepane" ? (
                    <Sidepane key={modal.id} onClose={() => hideModal(modal.id)} zIndex={zIndex}>
                        {modal.content}
                    </Sidepane>
                ) : (
                    <Popup key={modal.id} onClose={() => hideModal(modal.id)} zIndex={zIndex}>
                        {modal.content}
                    </Popup>
                );
            })}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal cannot be used outside ModalProvider");
    }
    return context;
}
