import React, { createContext, useContext, useState } from "react";

interface UserContextType {
  selected: number|null;
  setSelected: React.Dispatch<React.SetStateAction<number|null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected,setSelected] = useState<number|null>(null);

  return (
    <UserContext.Provider value={{selected,setSelected}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserProvider = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserProvider must be used within an AppProvider");
  }
  return context;
};
