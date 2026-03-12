'use client';

import {createContext, ReactNode, useCallback, useContext, useRef, useState, ComponentType} from "react";
import {Sidepane} from "@/components/layout/Sidepane";
import {Popup} from "@/components/layout/Popup";

type ModalContent = ReactNode | ComponentType<object>;

interface Modal {
    id: string;
    type: "sidepane" | "popup";
    content: ModalContent;
    onClose: () => void;
}

interface ModalContextType {
    showModal: (type: "sidepane" | "popup", content: ModalContent) => { id: string; close: () => void };
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
        if (handleClose) {
            handleClose();
        } else {
            // Fallback if no close handler is registered
            handleCloseRefs.current.delete(id);
            setModals(prevModals => prevModals.filter(modal => modal.id !== id));
        }
    }, []);

    const showModal = useCallback((type: "sidepane" | "popup", content: ModalContent): { id: string; close: () => void } => {
        const id = `modal-${Date.now()}-${Math.random()}`;

        setModals(prevModals => [...prevModals, {
            id,
            type,
            content,
            onClose: () => {
                handleCloseRefs.current.delete(id);
                setModals(prevModals => prevModals.filter(modal => modal.id !== id));
            }
        }]);

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
        
        // Dynamically render content: if it's a component type, instantiate it; otherwise use as-is
        const renderedContent = typeof modal.content === 'function' ? <modal.content /> : modal.content;

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
                    {renderedContent}
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


