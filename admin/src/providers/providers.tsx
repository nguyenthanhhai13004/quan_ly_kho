import React, { type ReactNode } from "react";
import AppProvider from "./app-providers";
import UserProvider from "./user-provider";

const combineProviders = (
  ...providers: React.ComponentType<{ children: ReactNode }>[]
) =>
  providers.reduce(
    (Combined, Provider) =>
      ({ children }: { children: ReactNode }) => (
        <Combined>
          <Provider>{children}</Provider>
        </Combined>
      ),
    ({ children }: { children: ReactNode }) => <>{children}</>,
  );

const CustomProviders = combineProviders(AppProvider,UserProvider);

export default function Providers({ children }: { children: ReactNode }) {
  return <CustomProviders>{children}</CustomProviders>;
}
