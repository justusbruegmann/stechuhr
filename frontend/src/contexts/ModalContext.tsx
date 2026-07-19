/**
 * This Provider is in large parts created with the use of GitHub Copilot.
 * It is not a piece of code mentioned under /docs/DOKU.md#Eigenleistung, and is therefore not to influence any team member's personal evaluation.
 */

'use client';

import {createContext, ReactNode, useCallback, useContext, useState} from "react";
import {Sidepane} from "@/components/layout/Sidepane";
import {Popup} from "@/components/layout/Popup";
import SpinningLoader from "@/components/layout/SpinningLoader";

type ModalType = "sidepane" | "popup" | "spinningLoader";

interface Modal {
    id: string;
    type: ModalType;
    content: ReactNode;
    onClose: () => void;
    onRegisterClose: (fn: () => void) => void;
}

interface ModalContextType {
    showModal: (type: ModalType, content?: ReactNode, contentDeps?: any[]) => { id: string; close: () => void };
    updateModalContent: (id: string, content: ReactNode) => void;
    hideModal: (id?: string) => void;
}

interface CurrentModalContextType {
    close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);
const CurrentModalContext = createContext<CurrentModalContextType | undefined>(undefined);

export default function ModalProvider({children}: { children: ReactNode }) {
    const [modals, setModals] = useState<Modal[]>([]);

    const hideModalById = useCallback((id: string) => {
        setModals(prevModals => prevModals.filter(modal => modal.id !== id));
    }, []);

    const showModal = useCallback((type: ModalType, content: ReactNode): { id: string; close: () => void } => {
        const id = `modal-${Date.now()}-${Math.random()}`;

        setModals(prevModals => [...prevModals, {
            id,
            type,
            content,
            onClose: () => hideModalById(id),
            onRegisterClose: () => {
            },
        }]);

        return {id, close: () => hideModalById(id)};
    }, [hideModalById]);

    const updateModalContent = useCallback((id: string, content: ReactNode) => {
        setModals(prevModals =>
            prevModals.map(modal => modal.id === id ? {...modal, content} : modal)
        );
    }, []);

    const hideModal = useCallback((id?: string) => {
        setModals(prevModals => {
            const targetId = id ?? prevModals[prevModals.length - 1]?.id;
            return targetId ? prevModals.filter(m => m.id !== targetId) : prevModals;
        });
    }, []);

    return (
        <ModalContext.Provider value={{showModal, hideModal, updateModalContent}}>
            {children}
            {modals.map((modal, index) => {
                let Component;
                switch (modal.type) {
                    case "sidepane":
                        Component = Sidepane;
                        break;
                    case "spinningLoader":
                        Component = SpinningLoader;
                        break;
                    default:
                        Component = Popup;
                        break;
                }

                return (
                    <CurrentModalContext.Provider
                        key={modal.id}
                        value={{close: () => hideModalById(modal.id)}}
                    >
                        <Component
                            onClose={modal.onClose}
                            zIndex={1000 + 10 * index}
                            onRegisterClose={modal.onRegisterClose}
                        >
                            {modal.content}
                        </Component>
                    </CurrentModalContext.Provider>
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

export function useCurrentModal() {
    const context = useContext(CurrentModalContext);
    if (!context) {
        throw new Error("useCurrentModal can only be used inside a modal's content");
    }
    return context;
}