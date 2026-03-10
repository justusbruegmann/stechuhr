'use client';

import {createContext, ReactNode, useCallback, useContext, useRef, useState} from "react";
import {Sidepane} from "@/components/layout/Sidepane";
import {Popup} from "@/components/layout/Popup";

interface Modal {
    id: string;
    type: "sidepane" | "popup";
    content: ReactNode;
    onClose: () => void;
}

interface ModalContextType {
    showModal: (type: "sidepane" | "popup", content: ReactNode) => { id: string; close: () => void };
    hideModal: (id?: string) => void;
}

interface CurrentModalContextType {
    close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);
const CurrentModalContext = createContext<CurrentModalContextType | undefined>(undefined);

export default function ModalProvider({children}: { children: ReactNode }) {
    const [modals, setModals] = useState<Modal[]>([]);
    const handleCloseRefs = useRef<Map<string, () => void>>(new Map());

    const triggerClose = useCallback((id: string) => {
        const handleClose = handleCloseRefs.current.get(id);
        handleClose?.();
    }, []);

    const showModal = useCallback((type: "sidepane" | "popup", content: ReactNode): { id: string; close: () => void } => {
        const id = `modal-${Date.now()}-${Math.random()}`;

        const onClose = () => {
            handleCloseRefs.current.delete(id);
            setModals(prevModals => prevModals.filter(modal => modal.id !== id));
        };

        // Register a default close handler so triggerClose works even before the
        // modal component mounts and calls onRegisterClose with its animated version.
        handleCloseRefs.current.set(id, onClose);

        setModals(prevModals => [...prevModals, {id, type, content, onClose}]);

        return {
            id,
            close: () => triggerClose(id)
        };
    }, [triggerClose]);

    const hideModal = useCallback((id?: string) => {
        const targetId = id === undefined ? modals[modals.length - 1]?.id : id;
        targetId && triggerClose(targetId);
    }, [modals, triggerClose]);

    const value = { showModal, hideModal };

    const renderModal = (modal: Modal, index: number) => {
        const zIndex = 1000 + 10 * index;
        const Component = modal.type === "sidepane" ? Sidepane : Popup;

        return (
            <CurrentModalContext.Provider
                key={modal.id}
                value={{ close: () => triggerClose(modal.id) }}
            >
                <Component
                    onClose={modal.onClose}
                    zIndex={zIndex}
                    onRegisterClose={(fn) => handleCloseRefs.current.set(modal.id, fn)}
                >
                    {modal.content}
                </Component>
            </CurrentModalContext.Provider>
        );
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            {modals.map(renderModal)}
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

export function useCurrentModal() {
    const context = useContext(CurrentModalContext);
    if (!context) {
        throw new Error("useCurrentModal can only be used inside a modal's content");
    }
    return context;
}


