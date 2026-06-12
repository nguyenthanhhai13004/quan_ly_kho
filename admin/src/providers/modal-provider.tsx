import React, { createContext, useContext, useState, type ReactNode } from "react";
import ConfirmModal from "../views/modals/confirm-modal";

interface DynamicModal {
  id: string;
  component: React.ComponentType<any>;
  props: any;
}

interface ConfirmModalState {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm?: () => void;
}

interface ModalContextType {
  openModal: <T extends Record<string, any>>(
    component: React.ComponentType<T>,
    props?: Omit<T, "open" | "onClose">
  ) => void;
  closeModal: () => void;
  closeAllModals: () => void;
  openConfirmModal: (options: Omit<ConfirmModalState, "open">) => void;
  closeConfirmModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<DynamicModal[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
  });

  const openModal = <T extends Record<string, any>>(
    component: React.ComponentType<T>,
    props?: Omit<T, "open" | "onClose">
  ) => {
    setModals((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        component,
        props: props || {},
      },
    ]);
  };

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  const openConfirmModal = (options: Omit<ConfirmModalState, "open">) => {
    setConfirmModal({ open: true, ...options });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeAllModals,
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
      
      {/* Dynamic Modals Stack */}
      {modals.map((modal, index) => {
        const Component = modal.component;
        return (
          <Component
            key={modal.id}
            {...modal.props}
            open={true}
            onClose={closeModal}
          />
        );
      })}

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        loading={confirmModal.loading}
        onClose={closeConfirmModal}
        onConfirm={() => {
          confirmModal.onConfirm?.();
          closeConfirmModal();
        }}
      />
    </ModalContext.Provider>
  );
};

export const useModalProvider = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalProvider must be used within a ModalProvider");
  }
  return context;
};

export default ModalProvider;
