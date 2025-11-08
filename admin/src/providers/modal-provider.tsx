import React, { createContext, useContext, useState } from "react";
import { ModalEnum, type ModalEnumType } from "../constants/modals.constant";

interface ModalContextType {
  currentModal:ModalEnumType,
  setCurrentModal:React.Dispatch<React.SetStateAction<ModalEnumType>>;
}

const AppContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentModal,setCurrentModal] = useState<ModalEnumType>(
      ModalEnum.CLOSE_MODAL
    );
  
  return (
    <AppContext.Provider value={{currentModal,setCurrentModal }}>
      {children}
    </AppContext.Provider>
  );
};

export default ModalProvider;

export const useModalProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useModalProvider must be used within an AppProvider");
  }
  return context;
};
