import React, { createContext, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ModalEnum, type ModalEnumType } from "../constants/modals.constant";
import ConfirmModal from "../views/modals/confirm-modal";

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
  currentModal: ModalEnumType;
  setCurrentModal: React.Dispatch<React.SetStateAction<ModalEnumType>>;
  handleCloseDetailModal: () => void;
  handleOpenDetailModal: (id: number, modal: ModalEnumType) => void;
  openConfirmModal: (options: Omit<ConfirmModalState, "open">) => void;
  closeConfirmModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentModal, setCurrentModal] = useState<ModalEnumType>(
    ModalEnum.CLOSE_MODAL,
  );
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const handleCloseDetailModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("id");

    const query = newParams.toString();
    setSearchParams(query ? newParams : undefined);

    setCurrentModal(ModalEnum.CLOSE_MODAL);
  };

  const handleOpenDetailModal = (id: number, modal: ModalEnumType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", String(id));
    setSearchParams(newParams);
    setCurrentModal(modal);
  };

  const closeModal = () => {
    setCurrentModal(ModalEnum.CLOSE_MODAL);
  }

  const openConfirmModal = (options: Omit<ConfirmModalState, "open">) => {
    setConfirmModal({ open: true, ...options });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <ModalContext.Provider
      value={{
        currentModal,
        closeModal,
        setCurrentModal,
        handleCloseDetailModal,
        handleOpenDetailModal,
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
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
