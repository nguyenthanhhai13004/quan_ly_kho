import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <AppContext.Provider value={{ toggle, setToggle }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppProvider must be used within an AppProvider");
  }
  return context;
};
